import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

const cards: string[] = []
let cardCopyCount: { [key: number]: number } = {}

const getScore = function (
  cardArray: string[],
  winningNumbersArray: string[]
): number {
  return winningNumbersArray.reduce((acc, cur) => {
    if (cardArray.includes(cur)) acc += 1
    return acc
  }, 0)
}

file.on('line', (line: string) => {
  if (line !== '') {
    const sanitisedLine = line.replace(/[ ]+/g, ' ')
    cards.push(sanitisedLine)
    const [cardNumberString] = sanitisedLine.split(': ')
    const cardNumber = +cardNumberString.split(' ')[1]
    cardCopyCount[cardNumber] = 1
  }
})

file.on('close', () => {
  for (let card of cards) {
    const [cardNumberString, games] = card.split(': ')
    const cardNumber = +cardNumberString.split(' ')[1]
    const [winningNumbers, myCard] = games.split(' | ')
    const winningNumbersArray = winningNumbers.split(' ')
    const myCardArray = myCard.split(' ')
    const currentScore = getScore(myCardArray, winningNumbersArray)
    for (let i = 1; i <= currentScore; i += 1) {
      cardCopyCount[cardNumber + i] += cardCopyCount[cardNumber]
    }
  }
  const total = Object.values(cardCopyCount).reduce((acc, cur) => acc + cur, 0)
  console.log('Part 2 =', total)
})
