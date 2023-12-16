import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

const grid: string[][] = []

type Beam = {
  coords: number[],
  direction: string
}

file.on('line', (line: string) => {
  if (line !== '') {
    grid.push(line.split(''))
  }
})

const advancePosition = function (beam: Beam): number[] | undefined {
  const { coords, direction } = beam
  const [y, x] = coords
  if (direction === 'e' && x < grid[0].length - 1) {
    return [y, x + 1]
  } else if (direction === 'n' && y > 0) {
    return [y - 1, x]
  } else if (direction === 'w' && x > 0) {
    return [y, x - 1]
  } else if (direction === 's' && y < grid.length - 1) {
    return [y + 1, x]
  }
  return
}

const getNewDirection = function (direction: string, mirror: string): string[] {
  const directions = 'eswn'
  if (mirror === '/') return ['nwse'[(directions.indexOf(direction))]]
  if (mirror === '\\') return ['senw'[(directions.indexOf(direction))]]
  if (mirror === '-' && ['n', 's'].includes(direction)) return ['e', 'w']
  if (mirror === '|' && ['e', 'w'].includes(direction)) return ['n', 's']
  return [direction]
}

const getNumberOfEnergisedTiles = function (initialBeams: Beam[]): number {
  const beamHistory = new Set()
  const energisedTiles = new Set()

  let beams = initialBeams

  while (beams.length > 0) {
    const newBeams: Beam[] = []
    beams.forEach((beam) => {
      const newPosition = advancePosition(beam)
      if (newPosition) {
        const [y, x] = newPosition
        energisedTiles.add(`${y}|${x}`)
        const newDirections = getNewDirection(beam.direction, grid[y][x])
        if (newDirections.length) {
          newDirections.forEach((newDirection) => {
            const [y, x] = newPosition
            energisedTiles.add(`${y}|${x}`)
            if (!beamHistory.has(`${y}|${x}|${newDirection}`)) {
              newBeams.push({ coords: [y, x], direction: newDirection })
              beamHistory.add(`${y}|${x}|${newDirection}`)
            }
          })
        }
      }
    })
    beams = newBeams
  }
  return energisedTiles.size
}

file.on('close', () => {
  let sum = 0;

  for (let i = 0; i < grid.length; i += 1) {
    const initialEastBeams: Beam[] = [{
      coords: [i, -1],
      direction: 'e'
    }]
    sum = Math.max(sum, getNumberOfEnergisedTiles(initialEastBeams))
    if (i === 0) {
      console.log('Part 1 =', sum)
    }
    const initialWestBeams: Beam[] = [{
      coords: [i, grid.length],
      direction: 'w'
    }]
    sum = Math.max(sum, getNumberOfEnergisedTiles(initialWestBeams))
  }
  for (let i = 0; i < grid[0].length; i += 1) {
    const initialSouthBeams: Beam[] = [{
      coords: [-1, i],
      direction: 's'
    }]
    sum = Math.max(sum, getNumberOfEnergisedTiles(initialSouthBeams))
    const initialNorthBeams: Beam[] = [{
      coords: [grid[0].length, i],
      direction: 'n'
    }]
    sum = Math.max(sum, getNumberOfEnergisedTiles(initialNorthBeams))
  }

  console.log('Part 2 =', sum)
})
