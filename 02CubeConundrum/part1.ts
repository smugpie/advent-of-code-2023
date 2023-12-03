import * as fs from 'fs'
import * as readline from 'readline'

type CubeColor = 'red' | 'green' | 'blue'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let validGameSum = 0

file.on('line', (line: string) => {
  if (line !== '') {
    const [gameNumberString, draws] = line.split(': ')
    const gameNumber = +gameNumberString.split(' ')[1]
    const drawArray = draws.split('; ')
    let isInvalidGame = false
    for (const draw of drawArray) {
      const cubes = draw.split(', ')
      for (const cube of cubes) {
        const [number, color] = cube.split(' ')
        const cubeColor = color as CubeColor
        // only 12 red cubes, 13 green cubes, and 14 blue cubes?
        if (
          (cubeColor === 'red' && +number > 12) ||
          (cubeColor === 'green' && +number > 13) ||
          (cubeColor === 'blue' && +number > 14)
        ) {
          isInvalidGame = true
        }
      }
    }
    if (!isInvalidGame) {
      validGameSum += gameNumber
    }
  }
})

file.on('close', () => {
  console.log('Part 1 =', validGameSum)
})
