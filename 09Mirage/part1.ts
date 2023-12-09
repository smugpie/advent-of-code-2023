import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let predictionSum = 0

const buildDifference = function (prediction: number[]): number[] {
  const difference: number[] = [];
  for (let i = 1; i < prediction.length; i += 1) {
    difference.push(prediction[i] - prediction[i - 1])
  }
  return difference
}

const arrayIsOnlyZeroes = function (arr: number[]): boolean {
  return arr.join('').replace(/0/g, '').length === 0
}

const findNextValue = function (predictions: number[][]): number {
  return predictions.reduce((acc, cur) => acc + cur[cur.length - 1], 0)
}

file.on('line', (line: string) => {
  const predictions: number[][] = [line.split(' ').map(num => +num)]

  while (!arrayIsOnlyZeroes(predictions[predictions.length - 1])) {
    predictions.push(buildDifference(predictions[predictions.length - 1]))
  }

  predictionSum += findNextValue(predictions)

})

file.on('close', () => {
  console.log('Part 1 =', predictionSum)
})
