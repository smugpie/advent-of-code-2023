import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let seeds: number[]
let locations: {[key: string]: number[][]}  = {
  'seed-to-soil': [],
  'soil-to-fertilizer': [],
  'fertilizer-to-water': [],
  'water-to-light': [],
  'light-to-temperature': [],
  'temperature-to-humidity': [],
  'humidity-to-location': []
}
let currentMap: string

file.on('line', (line: string) => {
  if (line.startsWith('seeds')) {
    const [, seedList] = line.split(': ')
    seeds = seedList.split(' ').map(num => +num)
  } else if (line.indexOf('map') > -1) {
    currentMap = line.split(' ')[0]
  } else if (line !== '') {
    locations[currentMap].push(line.split(' ').map(num => +num));
  }
})

const convertNumber = function(seed: number, map: string): number {
  let num = seed
  locations[map].forEach(location => {
    const [dest, src, range] = location
    if (seed >= src && seed < (src + range)) {
      num = seed - src + dest
    }
  })
  return num
}

file.on('close', () => {
  let newSeeds = seeds.map(seed => convertNumber(seed, 'seed-to-soil'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'soil-to-fertilizer'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'fertilizer-to-water'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'water-to-light'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'light-to-temperature'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'temperature-to-humidity'))
  newSeeds = newSeeds.map(seed => convertNumber(seed, 'humidity-to-location'))
  console.log('Part 1 = ', newSeeds.reduce((acc, cur) => Math.min(acc, cur), Infinity))
})
