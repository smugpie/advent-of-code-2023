import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0
let steps: string[] = []
let boxes: Label[][] = Array(256).fill([])

type Label = [string, number]

file.on('line', (line: string) => {
  if (line !== '') {
    steps = line.split(',')
  }
})

const getHash = function (s: string): number {
  let sArr = s.split('')
  return sArr.reduce((acc, cur) => (acc + cur.charCodeAt(0)) * 17 % 256, 0)
}

file.on('close', () => {
  steps.forEach(step => {
    const matches = step.match(/([a-z]+)([\-=])([0-9])*/)!
    const label = matches[1]
    const action = matches[2]
    const val = +matches[3]
    const boxNum = getHash(label)
    if (action === '-') {
      for (let i = 0; i < 256; i += 1) {
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

  let focussingPower = 0
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = 0; j < boxes[i].length; j += 1) {
      const [, val] = boxes[i][j]
      focussingPower += (i + 1) * (j + 1) * val
    }
  }
  console.log(focussingPower)
})
