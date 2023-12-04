import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0

const getScore = function (
  myCardArray: string[],
  winningNumbersArray: string[]
): number {
  const numberOfMatches = winningNumbersArray.reduce((acc, cur) => {
    if (myCardArray.includes(cur)) acc += 1
    return acc
  }, 0)
  if (numberOfMatches === 0) return 0
  return 2 ** (numberOfMatches - 1)
}

file.on('line', (line: string) => {
  if (line !== '') {
    const [, cards] = line.replace(/[ ]+/g, ' ').split(': ')
    const [winningNumbers, myCard] = cards.split(' | ')
    const winningNumbersArray = winningNumbers.split(' ')
    const myCardArray = myCard.split(' ')
    sum += getScore(myCardArray, winningNumbersArray)
  }
})

file.on('close', () => {
  console.log('Part 1 =', sum)
})
