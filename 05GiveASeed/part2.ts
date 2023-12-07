import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
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
    const [destination, start, distance] = arr
    locations[currentMap].push({
      start,
      end: start + distance - 1,
      delta: destination - start
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

const convertRanges = function (ranges: Range[], stage: Location[]): Range[] {
  let mappedRanges: Range[] = []
  let finalUnmappedRanges: Range[] = []
  for (const range of ranges) {
    let unmappedRanges = [range]
    stage.forEach((mapping) => {
      if (unmappedRanges.length) {
        const mappingResult = unmappedRanges.map((unmappedRange) =>
          remapRange(unmappedRange, mapping)
        )
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
    locations.forEach((stage) => {
      ranges = convertRanges(ranges, stage)
    })
    lowest = Math.min(
      lowest,
      ranges.reduce((acc, cur) => Math.min(acc, cur.start), Infinity)
    )
  }

  console.log('Part 2 = ', lowest)
})
