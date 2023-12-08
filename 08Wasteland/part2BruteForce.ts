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
      const [name, left, right] = line.match(/[A-Z0-9]{3}/g) as string[]
      paths[name] = { left, right }
    }
  }
})

file.on('close', () => {
  let stepCount = 0
  let currentDirections: string[] = []
  let currentPlaces = Object.keys(paths).filter((path) => path.endsWith('A'))
  let destinationReached = false
  while (!destinationReached) {
    if (currentDirections.length === 0) {
      currentDirections = [...directions]
    }

    const currentDirection = currentDirections.shift()
    currentPlaces = currentPlaces.map((place) => {
      if (currentDirection === 'L') {
        place = paths[place].left
      } else if (currentDirection === 'R') {
        place = paths[place].right
      }
      return place
    })

    stepCount += 1
    if (currentPlaces.filter((place) => !place.endsWith('Z')).length === 0) {
      destinationReached = true
    }
  }
  console.log('Part 2 =', stepCount)
})
