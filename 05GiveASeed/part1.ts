import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let seeds: number[]
let locations: number[][][] = []
let currentMap = -1

file.on('line', (line: string) => {
  if (line.startsWith('seeds')) {
    const [, seedList] = line.split(': ')
    seeds = seedList.split(' ').map((num) => +num)
  } else if (line.indexOf('map') > -1) {
    currentMap += 1
    locations[currentMap] = []
  } else if (line !== '') {
    locations[currentMap].push(line.split(' ').map((num) => +num))
  }
})

const convertNumber = function (seed: number, map: number): number {
  let num = seed
  locations[map].forEach((location) => {
    const [dest, src, range] = location
    if (seed >= src && seed < src + range) {
      num = seed - src + dest
    }
  })
  return num
}

file.on('close', () => {
  let newSeeds: number[] = [...seeds]
  for (let i = 0; i < locations.length; i += 1) {
    newSeeds = newSeeds.map((seed) => convertNumber(seed, i))
  }
  console.log(
    'Part 1 = ',
    newSeeds.reduce((acc, cur) => Math.min(acc, cur), Infinity)
  )
})
