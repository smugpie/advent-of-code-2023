import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0
let steps: string[] = []

file.on('line', (line: string) => {
  if (line !== '') {
    steps = line.split(',')
  }
})

const getHash = function (s: string): number {
  return s.split('').reduce((acc, cur) => (acc + cur.charCodeAt(0)) * 17 % 256, 0)
}

file.on('close', () => {
  sum = steps.reduce((acc, cur) => acc + getHash(cur), 0)
  console.log('Part 1 =', sum)
})
