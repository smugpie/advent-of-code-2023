import * as fs from 'fs'
import * as readline from 'readline'

type CubeColor = 'red' | 'green' | 'blue'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let validGameSum = 0

file.on('line', (line: string) => {
  if (line !== '') {
    const [, draws] = line.split(': ')
    const drawArray = draws.split('; ')
    let cubeNumbers: { [key in CubeColor]: number } = {
      red: 0,
      green: 0,
      blue: 0
    }
    for (const draw of drawArray) {
      const cubes = draw.split(', ')
      for (const cube of cubes) {
        const [number, color] = cube.split(' ')
        const cubeColor = color as CubeColor
        cubeNumbers[cubeColor] = Math.max(cubeNumbers[cubeColor], +number)
      }
    }
    validGameSum += cubeNumbers.red * cubeNumbers.green * cubeNumbers.blue
  }
})

file.on('close', () => {
  console.log('Part 2 =', validGameSum)
})
