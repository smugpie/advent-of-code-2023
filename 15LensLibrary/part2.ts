import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let focussingPower = 0
let steps: string[] = []
let boxes: Label[][] = Array(256).fill([])

type Label = [string, number]

file.on('line', (line: string) => {
  if (line !== '') {
    steps = line.split(',')
  }
})

const getHash = function (s: string): number {
  return s.split('').reduce((acc, cur) => (acc + cur.charCodeAt(0)) * 17 % 256, 0)
}

file.on('close', () => {
  steps.forEach(step => {
    const matches = step.match(/([a-z]+)([\-=])([0-9])*/)!
    const [, label, action, stVal] = matches
    const val = +stVal
    const boxNum = getHash(label)
    if (action === '-') {
      for (let i = 0; i < boxes.length; i += 1) {
        boxes[i] = [...boxes[i].filter(([thisLabel]) => label !== thisLabel)]
      }
    } else {
      const found = boxes[boxNum].findIndex(([thisLabel]) => label === thisLabel)
      if (found >= 0) {
        boxes[boxNum][found] = [label, val]
      } else {
        boxes[boxNum] = [...boxes[boxNum], [label, val]]
      }
    }
  })

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = 0; j < boxes[i].length; j += 1) {
      const [, val] = boxes[i][j]
      focussingPower += (i + 1) * (j + 1) * val
    }
  }
  console.log('Part 2 =', focussingPower)
})
