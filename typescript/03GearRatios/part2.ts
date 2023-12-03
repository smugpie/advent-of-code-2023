import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let schematic: string[] = [];
let sum = 0;

file.on('line', (line: string) => {
  if (line !== '') {
    schematic.push(`.${line}.`)
  }
})

const hasAGearSymbol = /\*/
let gearSymbols: {[key: string]: number[]} = {}

file.on('close', () => {
  const paddedLine = Array(schematic[0].length).fill('.').join('')
  const paddedSchematic = [paddedLine, ...schematic, paddedLine]
  paddedSchematic.forEach((line, y) => {
    line.split('').forEach((char, x) => {
      if (char === '*') {
        gearSymbols[`${y},${x}`] = []
      }
    })
  })

  const addValueToGearSymbol = function(y: number, x: number, value: string): void {
    const lineFragment = paddedSchematic[y].substr(x - 1, value.length + 2);
    if (hasAGearSymbol.test(lineFragment)) {
      gearSymbols[`${y},${x + lineFragment.indexOf('*') - 1}`].push(+value)
    }
  }

  paddedSchematic.forEach((line, y) => {
    const matches = line.matchAll(/[0-9]+/g)
    for (const match of matches) {
      const [value] = match
      const { index: x, input } = match
      if (x && input) {
        addValueToGearSymbol(y - 1, x, value);
        addValueToGearSymbol(y, x, value);
        addValueToGearSymbol(y + 1, x, value);
      }
    }
  })

  for (const v of Object.values(gearSymbols)) {
    if (v.length === 2) {
      const [first, second] = v
      sum += first * second
    }
  }

  console.log('Part 2 =', sum)
})
