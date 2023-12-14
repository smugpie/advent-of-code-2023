import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let sum = 0

file.on('line', (line: string) => {
  let [conditions, pattern] = line.split(' ')

  conditions = `${conditions}?${conditions}?${conditions}?${conditions}?${conditions}`
  pattern = `${pattern},${pattern},${pattern},${pattern},${pattern}`

  conditions = conditions.replace(/(\.)+$/g, '')

  const patternArray = pattern.split(',').map(num => +num)

  const getLastPositionOfObject = function (conditions: string, patternArray: number[]): number {
    return conditions.length - patternArray.reduce((acc, cur) => acc + cur + 1, 0) + 1
  }

  const cache = new Map()

  const placeObject = function (conditions: string, pattern: number[], startPoint: number, endPoint: number, prevPos: number) {
    const objKey = `${JSON.stringify(pattern)}|${startPoint}|${endPoint}}`
    if (cache.has(objKey)) { return cache.get(objKey) }

    let thisSum = 0
    const [currentPattern] = pattern
    for (let i = startPoint; i <= endPoint; i += 1) {
      const testPosition = conditions.substring(i, i + currentPattern)
      let invalid = false

      if (testPosition.indexOf('.') >= 0) {
        invalid = true
      } else if (conditions.slice(prevPos, i).indexOf('#') >= 0) {
        invalid = true
      } else if (conditions[currentPattern + i] === '#') {
        invalid = true
      } else if (pattern.length === 1 && conditions.slice(currentPattern + i).indexOf('#') > 0) {
        invalid = true
      }

      if (!invalid) {
        if (pattern.length > 1) {
          const newPattern: number[] = [...pattern]
          const firstNumber = newPattern.shift()
          thisSum += placeObject(conditions, newPattern, i + firstNumber! + 1, endPoint + firstNumber! + 1, currentPattern + i)
        } else {
          thisSum += 1
        }
      }
    }
    cache.set(objKey, thisSum)
    return thisSum
  }

  const currSum = placeObject(conditions, patternArray, 0, getLastPositionOfObject(conditions, patternArray), 0)

  console.log(currSum)
  sum += currSum
  console.timeEnd()
})

file.on('close', () => {
  console.log('Part 2 =', sum)
})
