import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input2.txt')
})

type Location = {
  start: number
  end: number
  delta: number
}

type Range = {
  start: number
  end: number
}

type MappedRanges = {
  unmapped?: Range[]
  mapped?: Range[]
}

let seeds: number[]
let locations: Location[][] = []
let currentMap = -1

file.on('line', (line: string) => {
  if (line.startsWith('seeds')) {
    const [, seedList] = line.split(': ')
    seeds = seedList.split(' ').map((num) => +num)
  } else if (line.indexOf('map') > -1) {
    currentMap += 1
    locations[currentMap] = []
  } else if (line !== '') {
    const arr = line.split(' ').map((num) => +num)
    locations[currentMap].push({
      start: arr[1],
      end: arr[1] + arr[2],
      delta: arr[0] - arr[1]
    })
  }
})

const remapRange = function (range: Range, loc: Location): MappedRanges {
  const { start: mapStart, end: mapEnd, delta } = loc
  const { start: rangeStart, end: rangeEnd } = range

  if (rangeStart > mapEnd || rangeEnd < mapStart) {
    return { unmapped: [range] }
  }

  if (rangeStart >= mapStart)
    if (rangeEnd <= mapEnd) {
      return {
        mapped: [{ start: rangeStart + delta, end: rangeEnd + delta }]
      }
    } else {
      return {
        mapped: [{ start: rangeStart + delta, end: mapEnd + delta }],
        unmapped: [{ start: mapEnd + 1, end: rangeEnd }]
      }
    }

  if (rangeStart < mapStart) {
    if (rangeEnd <= mapEnd) {
      return {
        mapped: [{ start: mapStart + delta, end: rangeEnd + delta }],
        unmapped: [{ start: rangeStart, end: mapStart - 1 }]
      }
    } else {
      return {
        mapped: [{ start: mapStart + delta, end: mapEnd + delta }],
        unmapped: [
          { start: rangeStart, end: mapStart - 1 },
          { start: mapEnd + 1, end: rangeEnd }
        ]
      }
    }
  }
  return { unmapped: [range] }
}

const convertRanges = function (
  ranges: Range[],
  stage: Location[],
  debug: boolean
): Range[] {
  let mappedRanges: Range[] = []
  let finalUnmappedRanges: Range[] = []
  for (const range of ranges) {
    let unmappedRanges = [range]
    stage.forEach((mapping) => {
      if (unmappedRanges.length) {
        if (debug)
          console.log(
            '---trying',
            mapping,
            'with unmapped ranges',
            unmappedRanges
          )

        const mappingResult = unmappedRanges.map((unmappedRange) =>
          remapRange(unmappedRange, mapping)
        )
        if (debug) console.log('result', JSON.stringify(mappingResult))
        unmappedRanges = []
        mappingResult.forEach(({ mapped, unmapped }) => {
          mappedRanges = [...mappedRanges, ...(mapped || [])]
          unmappedRanges = [...unmappedRanges, ...(unmapped || [])]
        })
      }
    })
    finalUnmappedRanges = [...finalUnmappedRanges, ...unmappedRanges]
  }
  return [...mappedRanges, ...finalUnmappedRanges]
}

file.on('close', () => {
  let lowest = Infinity
  for (let j = 0; j < seeds.length; j += 2) {
    let ranges: Range[] = [
      { start: seeds[j], end: seeds[j] + seeds[j + 1] - 1 }
    ]
    console.log('considering', ranges, 'a distance of', seeds[j + 1])
    locations.forEach((stage, idx) => {
      ranges = convertRanges(ranges, stage, idx === 1)
      console.log('!!! at the end of stage', idx, 'we have ', ranges)
    })
    lowest = Math.min(
      lowest,
      ranges.reduce((acc, cur) => Math.min(acc, cur.start), Infinity)
    )
  }

  console.log('Part 2 = ', lowest)
})
