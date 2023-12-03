import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

const lines: string[] = []
let sum: number = 0
const replacements = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

const getFirstAndLastValuesFromArray = function (arrayOfNums: string[]): number {
  return parseInt(`${arrayOfNums[0]}${arrayOfNums[arrayOfNums.length-1]}`, 10)
}

const findNumbersInString = function (line: string): string[] {
  let arrayOfNums: string[] = []
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (/\d/.test(char)) {
      arrayOfNums.push(char);
    } else {
      replacements.forEach((item, index) => {
        if (line.indexOf(item, i) === i) {
          arrayOfNums.push(index.toString())
        }
      })
    }
  }
  return arrayOfNums
}

file.on('line', (line: string) => {
  if (line !== '') {
    sum += getFirstAndLastValuesFromArray(findNumbersInString(line))
  }
})

file.on('close', () => {
  console.log('Part 2 =', sum)
})
