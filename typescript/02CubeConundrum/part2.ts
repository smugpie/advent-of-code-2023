import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let validGameSum = 0

file.on('line', (line: string) => {
  if (line !== '') {
    const [, draws] = line.split(': ')
    const drawArray = draws.split('; ')
    let cubeNumbers: { [key: string]: number } = {
      red: 0,
      green: 0,
      blue: 0
    }
    for (const draw of drawArray) {
      const cubes = draw.split(', ')
      for (const cube of cubes) {
        const [number, color] = cube.split(' ')
        cubeNumbers[color] = Math.max(cubeNumbers[color], +number)
      }
    }
    console.log(cubeNumbers)
    validGameSum += cubeNumbers.red * cubeNumbers.green * cubeNumbers.blue
  }
})

file.on('close', () => {
  console.log('Part 2 =', validGameSum)
})
