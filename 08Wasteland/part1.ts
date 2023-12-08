import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let directions: string[]

type Path = {
  left: string
  right: string
}

const paths: { [key: string]: Path } = {}

file.on('line', (line: string) => {
  if (line !== '') {
    if (!directions) {
      directions = line.split('')
    } else {
      const [name, left, right] = line.match(/[A-Z]{3}/g) as string[]
      paths[name] = { left, right }
    }
  }
})

file.on('close', () => {
  let stepCount = 0
  let currentDirections: string[] = []
  let currentPlace = 'AAA'
  let destinationReached = false
  while (!destinationReached) {
    if (currentDirections.length === 0) {
      currentDirections = [...directions]
    }

    const currentDirection = currentDirections.shift()
    if (currentDirection === 'L') {
      currentPlace = paths[currentPlace].left
    } else if (currentDirection === 'R') {
      currentPlace = paths[currentPlace].right
    }

    stepCount += 1
    if (currentPlace === 'ZZZ') {
      destinationReached = true
    }
  }
  console.log('Part 1 =', stepCount)
})
