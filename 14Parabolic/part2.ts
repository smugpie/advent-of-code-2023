import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

const NUMBER_OF_ITERATIONS = 1000000000

let grid: string[][] = []

file.on('line', (line: string) => {
  if (line !== '') {
    grid.push(line.split(''))
  }
})

const moveGridNorth = function (): void {
  for (let y = 1; y < grid.length; y += 1) {
    for (let x = 0; x < grid[0].length; x += 1) {
      if (grid[y][x] === 'O') {
        let newY = y

        while (newY > 0) {
          if (grid[newY - 1][x] !== '.') break;
          newY -= 1
        }

        grid[y][x] = '.'
        grid[newY][x] = 'O'
      }
    }
  }
}

const moveGridSouth = function (): void {
  for (let y = grid.length - 2; y >= 0; y -= 1) {
    for (let x = 0; x < grid[0].length; x += 1) {
      if (grid[y][x] === 'O') {
        let newY = y

        while (newY < grid.length - 1) {
          if (grid[newY + 1][x] !== '.') break;
          newY += 1
        }

        grid[y][x] = '.'
        grid[newY][x] = 'O'
      }
    }
  }
}

const moveGridWest = function (): void {
  for (let x = 1; x < grid[0].length; x += 1) {
    for (let y = 0; y < grid.length; y += 1) {
      if (grid[y][x] === 'O') {
        let newX = x

        while (newX > 0) {
          if (grid[y][newX - 1] !== '.') break;
          newX -= 1
        }

        grid[y][x] = '.'
        grid[y][newX] = 'O'
      }
    }
  }
}

const moveGridEast = function (): void {
  for (let x = grid[0].length - 2; x >= 0; x -= 1) {
    for (let y = 0; y < grid.length; y += 1) {
      if (grid[y][x] === 'O') {
        let newX = x

        while (newX < grid[0].length - 1) {
          if (grid[y][newX + 1] !== '.') break;
          newX += 1
        }

        grid[y][x] = '.'
        grid[y][newX] = 'O'
      }
    }
  }
}

const cache = new Map()

let initial = 0
let period = 0

const moveGrid = function (i: number): boolean {
  const oldGridJSON = JSON.stringify(grid)
  if (cache.has(oldGridJSON)) {
    let { i: newI } = JSON.parse(cache.get(oldGridJSON))
    initial = i; period = i - newI
    return true
  }
  moveGridNorth()
  moveGridWest()
  moveGridSouth()
  moveGridEast()
  cache.set(oldGridJSON, JSON.stringify({ i, grid }))
  return false
}

file.on('close', () => {
  let sum = 0
  for (let i = 1; i <= NUMBER_OF_ITERATIONS; i += 1) {
    if (moveGrid(i)) {
      break
    }
  }

  const numberOfCompleteCycles = NUMBER_OF_ITERATIONS - initial
  const itemToFind = (numberOfCompleteCycles % period) + initial - period

  for (let [k, v] of cache.entries()) {
    if (JSON.parse(v).i === itemToFind) {
      grid = JSON.parse(v).grid
      break
    }

  }
  for (let y = 0; y < grid.length; y += 1) {
    sum += (grid[y].filter((x) => x === 'O').length) * (grid.length - y)
  }
  console.log('Part 2 =', sum)
})
