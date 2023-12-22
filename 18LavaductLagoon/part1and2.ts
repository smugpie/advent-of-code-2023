import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

type Point = {
  y: number,
  x: number
}

let grid: string[] = []
let startPoint: Point

file.on('line', (line: string) => {
  grid.push(`.${line}.`)
  if (line.indexOf('S') >= 0) {
    startPoint = { y: grid.length, x: line.indexOf('S') + 1 }
  }
})

const findNextPoints = function (point: Point): Point[] {
  const points: Point[] = []
  const { y, x } = point
  if ('JL|S'.indexOf(grid[y][x]) >= 0 &&
    'F7|S'.indexOf(grid[y - 1][x]) >= 0) {
    points.push({ y: y - 1, x })
  }
  if (
    'JL|S'.indexOf(grid[y + 1][x]) >= 0 &&
    'F7|S'.indexOf(grid[y][x]) >= 0) {
    points.push({ y: y + 1, x })
  }
  if (
    'F-LS'.indexOf(grid[y][x - 1]) >= 0 &&
    'J-7S'.indexOf(grid[y][x]) >= 0) {
    points.push({ y, x: x - 1 })
  }
  if (
    'J-7S'.indexOf(grid[y][x + 1]) >= 0 &&
    'F-LS'.indexOf(grid[y][x]) >= 0) {
    points.push({ y, x: x + 1 })
  }
  return points
}


file.on('close', () => {
  const startPointCharacter = function (): string {
    const firstPoint = loop[1]
    const lastPoint = loop[loop.length - 1]
    if (lastPoint.y === firstPoint.y + 1) {
      return lastPoint.x === firstPoint.x + 1 ? 'L' : 'J'
    } else if (lastPoint.y === firstPoint.y - 1) {
      return lastPoint.x === firstPoint.x + 1 ? 'F' : '7'
    } else if (Math.abs(firstPoint.y - lastPoint.y) === 2) {
      return '|'
    } else if (Math.abs(firstPoint.x - lastPoint.x) === 2) {
      return '-'
    }
    return '.'
  }

  const padding = Array(grid[0].length).fill('.').join('')
  grid = [padding, ...grid, padding]

  const loop: Point[] = [startPoint]
  let [currentPoint] = findNextPoints(startPoint)
  loop.push(currentPoint)

  while (true) {
    const nextPoints: Point[] = findNextPoints(currentPoint)

    currentPoint = nextPoints.filter(
      ({ y, x }) => y !== loop[loop.length - 2].y || x !== loop[loop.length - 2].x
    )[0]

    if (currentPoint.y === startPoint.y && currentPoint.x === startPoint.x) {
      break
    }
    loop.push(currentPoint)
  }
  console.log('Part 1 =', (loop.length) / 2)

  let numberOfInsidePoints = 0

  const startChar = startPointCharacter()
  grid.forEach((row, y) => {
    let pointIsInside = false;

    row = row.replace('S', startChar)
    let beginningOfPathBoundary = -1
    for (let x = 0; x < row.length; x += 1) {
      let currentPoint = row[x]
      let endOfPathBoundary = -1
      let pointIsInLoop = loop.filter((point) => point.x === x && point.y === y).length > 0

      // work out whether we've hit a boundary by seeing if
      // the path boundary crosses the row
      // e.g L--J or F---7 doesn't cross
      // but L--7 or F---J or | does
      if (pointIsInLoop) {
        if ('L|F'.indexOf(currentPoint) >= 0) {
          beginningOfPathBoundary = 'L|F'.indexOf(currentPoint)
        }

        if ('7|J'.indexOf(currentPoint) >= 0) {
          endOfPathBoundary = '7|J'.indexOf(currentPoint)
          if (beginningOfPathBoundary === endOfPathBoundary) {
            pointIsInside = !pointIsInside;
          }
        }
      } else if (pointIsInside) {
        numberOfInsidePoints += 1
      }
    }
  })

  console.log('Part 2 =', numberOfInsidePoints)
})
