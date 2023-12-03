import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let schematic: string[] = []
let sum = 0

file.on('line', (line: string) => {
  if (line !== '') {
    schematic.push(`.${line}.`)
  }
})

const isASymbol = /[^0-9\.]/

const testSubstring = function (
  line: string,
  value: string,
  x: number
): boolean {
  return isASymbol.test(line.substr(x - 1, value.length + 2))
}

file.on('close', () => {
  const paddedLine = Array(schematic[0].length).fill('.').join('')
  const paddedSchematic = [paddedLine, ...schematic, paddedLine]
  paddedSchematic.forEach((line, y) => {
    const matches = line.matchAll(/[0-9]+/g)
    for (const match of matches) {
      const [value] = match
      const { index, input } = match
      if (index && input) {
        const isValidMatch =
          testSubstring(paddedSchematic[y], value, index) ||
          testSubstring(paddedSchematic[y - 1], value, index) ||
          testSubstring(paddedSchematic[y + 1], value, index)
        if (isValidMatch) sum += +value
      }
    }
  })
  console.log('Part 1 =', sum)
})
