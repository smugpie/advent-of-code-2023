import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0

console.time()

file.on('line', (line: string) => {
  const [conditions, pattern] = line.split(' ')

  const testItem = function (conditions: string): void {
    if (conditions.indexOf('?') >= 0) {
      testItem(conditions.replace('?', '#'))
      testItem(conditions.replace('?', '.'))
    } else {
      const patternLengths = conditions.replace(/(\.)+/g, ' ').trim().split(' ').map((s) => s.length).join()
      if (pattern === patternLengths) sum += 1
    }
  }

  testItem(conditions)
})

file.on('close', () => {
  console.log('Part 1 =', sum)
  console.timeEnd()
})
