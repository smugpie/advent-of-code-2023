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

type StepCount = {
  stepCount: number
  destination: string
  sequenceCount: number
}

const paths: { [key: string]: Path } = {}

const map: { [key: string]: StepCount } = {}

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

const getStepCount = function (place: string): StepCount {
  let stepCount = 0
  let currentDirections: string[] = []
  let currentPlace = place
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
    if (currentPlace.endsWith('Z')) {
      destinationReached = true
    }
  }
  return {
    stepCount,
    destination: currentPlace,
    sequenceCount: stepCount / directions.length
  }
}

file.on('close', () => {
  const sourcePlaces = Object.keys(paths).filter((path) => path.endsWith('A'))
  const currentPlaces = [...sourcePlaces]

  while (currentPlaces.length > 0) {
    const place = currentPlaces.shift()!
    if (!map[place]) {
      map[place] = getStepCount(place)
      if (!map[map[place].destination]) {
        currentPlaces.push(map[place].destination)
      }
    }
  }

  const isPrime = function (num: number): boolean {
    for (let i = 2; i < num; i += 1) {
      if (num % i === 0) return false
    }
    return true
  }

  // here we test that there is no variation in step counts when visiting a destination that ends in Z
  // and we check that the step count is a multiple of the sequence of stepa
  // and the number of times we loop through the sequence is a prime number
  // so we don't have to calculate the least common multiple
  const invalidSourcesForThisExercise = sourcePlaces.filter((place) => {
    return !(
      map[place].sequenceCount === Math.round(map[place].sequenceCount) &&
      map[place].sequenceCount === map[map[place].destination].sequenceCount &&
      isPrime(map[place].sequenceCount)
    )
  })

  if (invalidSourcesForThisExercise.length > 0) {
    console.log('Cannot use this method to calculate the result')
    return
  }

  const multiples = sourcePlaces.reduce(
    (acc, cur) => (acc *= map[cur].sequenceCount),
    1
  )
  console.log('Part 2 =', multiples * directions.length)
})
