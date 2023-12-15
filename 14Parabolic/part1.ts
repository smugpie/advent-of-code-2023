import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let grid: string[][] = []

file.on('line', (line: string) => {
  if (line !== '') {
    grid.push(line.split(''))
  }
})


file.on('close', () => {
  let sum = 0
  console.log(grid)

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
  grid.forEach((row) => console.log(row.join('')))

  for (let y = 0; y < grid.length; y += 1) {
    sum += (grid[y].filter((x) => x === 'O').length) * (grid.length - y)
  }
  console.log('Part 1 =', sum)
})
