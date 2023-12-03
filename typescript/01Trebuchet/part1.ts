import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0

const getFirstAndLastDigitsFromArray = function (
  arrayOfNums: string[]
): number {
  return parseInt(`${arrayOfNums[0]}${arrayOfNums[arrayOfNums.length - 1]}`, 10)
}

const stripNonNumericCharacters = function (line: string): string[] {
  return line.match(/\d/g) as string[]
}

file.on('line', (line: string) => {
  if (line !== '') {
    sum += getFirstAndLastDigitsFromArray(stripNonNumericCharacters(line))
  }
})

file.on('close', () => {
  console.log('Part 1 =', sum)
})
