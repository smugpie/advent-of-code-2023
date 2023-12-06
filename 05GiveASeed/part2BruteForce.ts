import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./testinput.txt')
})

type Location = {
  start: number
  end: number
  delta: number
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

const convertNumber = function (seed: number, map: number): number {
  const len = locations[map].length
  for (let i = 0; i < len; i += 1) {
    const location = locations[map][i]
    if (seed >= location.start && seed < location.end) {
      return seed + location.delta
    }
  }
  return seed
}

file.on('close', () => {
  let lowest = Infinity
  for (let j = 0; j < seeds.length; j += 2) {
    let initialSeed = seeds[j]
    let finalSeed = initialSeed + seeds[j + 1]
    console.time('this iteration')
    console.log(
      'considering',
      initialSeed,
      'to',
      finalSeed,
      'a range of',
      seeds[j + 1]
    )
    for (
      let currentSeed = initialSeed;
      currentSeed < finalSeed;
      currentSeed += 1
    ) {
      let newSeed = currentSeed
      for (let i = 0; i < locations.length; i += 1) {
        newSeed = convertNumber(newSeed, i)
      }
      lowest = Math.min(lowest, newSeed)
    }
    console.timeEnd('this iteration')
  }

  console.log('Part 2 = ', lowest)
})
