import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

const grid: string[][] = []

const expandedRows: number[] = []
const expandedCols: number[] = []
let colCount: number[]
const galaxies: string[] = []

file.on('line', (line: string) => {
  const lineArr = line.split('')
  grid.push(lineArr)
})

file.on('close', () => {
  colCount = Array(grid[0].length).fill(0)
  grid.forEach((row, y) => {
    let rowCount = 0
    row.forEach((point, x) => {
      if (point === '#') {
        galaxies.push(`${y},${x}`)
        rowCount += 1
        colCount[x] += 1
      }
    })
    if (rowCount === 0) expandedRows.push(y)
  })
  colCount.forEach((col, x) => { if (col === 0) expandedCols.push(x) })

  const calcDistance = function (p1: string, p2: string, expansionFactor: number): number {
    const extraRows = expansionFactor - 1

    const [p1y, p1x] = p1.split(',')
    const [p2y, p2x] = p2.split(',')

    const y1 = Math.min(+p1y, +p2y)
    const y2 = Math.max(+p1y, +p2y)

    const x1 = Math.min(+p1x, +p2x)
    const x2 = Math.max(+p1x, +p2x)

    const yDist = y2 - y1 + (expandedRows.filter((n) => n > y1 && n < y2).length * extraRows)
    const xDist = x2 - x1 + (expandedCols.filter((n) => n > x1 && n < x2).length * extraRows)

    return yDist + xDist
  }

  const calcDistances = function (expansionFactor: number): number {
    let sum = 0

    for (let i = 0; i < galaxies.length - 1; i += 1) {
      for (let j = i + 1; j < galaxies.length; j += 1) {
        sum += calcDistance(galaxies[i], galaxies[j], expansionFactor)
      }
    }

    return sum
  }

  console.log('Part 1 =', calcDistances(2))
  console.log('Part 2 =', calcDistances(1000000))
})
