import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

type Breakdown = { [key: number]: number }

type HandInfo = {
  hand: number[]
  bid: number
  breakdown: Breakdown
}

const hands: HandInfo[] = []
const strength = 'J23456789TQKA'

file.on('line', (line: string) => {
  if (line !== '') {
    const [handString, bid] = line.split(' ')
    const hand = handString.split('').map((card) => strength.indexOf(card))
    const breakdown: Breakdown = {}
    hand.forEach((card) => {
      if (!breakdown[card]) breakdown[card] = 0
      breakdown[card] += 1
    })

    hands.push({ hand, bid: +bid, breakdown })
  }
})

const getHandType = function (hand: Breakdown): number {
  let numberOfJokers = hand[0]
  if (numberOfJokers === 5) return 6
  const handWithoutJokers = { ...hand }
  delete handWithoutJokers[0]
  const values = [...Object.values(handWithoutJokers).sort((a, b) => b - a)]
  let currentValue = 0
  while (numberOfJokers > 0) {
    if (values[currentValue] < 5) {
      if (numberOfJokers + values[currentValue] > 5) {
        return 6
      } else {
        values[currentValue] += numberOfJokers
        numberOfJokers = 0
      }
    }
  }

  if (values[0] === 5) return 6
  if (values[0] === 4) return 5
  if (values[0] === 3 && values[1] === 2) return 4
  if (values[0] === 3) return 3
  if (values[0] === 2 && values[1] === 2) return 2
  if (values[0] === 2) return 1
  return 0
}

file.on('close', () => {
  hands.sort((a, b) => {
    const aStrength = getHandType(a.breakdown)
    const bStrength = getHandType(b.breakdown)
    if (aStrength !== bStrength) return aStrength - bStrength
    for (let i = 0; i < 5; i += 1) {
      if (a.hand[i] !== b.hand[i]) {
        return a.hand[i] - b.hand[i]
      }
    }
    return 0
  })

  let sum = 0
  hands.forEach(({ bid }, idx) => (sum += (idx + 1) * bid))
  console.log('Part 2 =', sum)
})
