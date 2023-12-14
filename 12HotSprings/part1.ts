import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0

console.time()

file.on('line', (line: string) => {
  const [conditions, pattern] = line.split(' ')
  const patternArray = pattern.split(',').map(num => +num)

  const testItem = function (conditions: string): void {
    const firstQ = conditions.indexOf('?')
    const knownPattern = conditions.slice(0, firstQ)
    if (firstQ >= 0) {
      const knownPatternLengths = knownPattern.replace(/(\.)+/g, ' ').trim().split(' ')
      for (let i = 0; i < knownPatternLengths.length - 1; i += 1) {
        if (knownPatternLengths[i].length !== patternArray[i]) { return }
      }

      const last = knownPatternLengths.length - 1
      if (knownPatternLengths[last].length > patternArray[last]) { return }
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
