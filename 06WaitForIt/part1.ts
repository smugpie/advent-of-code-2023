import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

type RaceInfo = {
  time: number
  distance: number
}

const races: RaceInfo[] = []

file.on('line', (line: string) => {
  if (line !== '') {
    const [type, values] = line.split(':')
    const valueArray = values
      .trim()
      .replace(/[ ]+/g, ' ')
      .split(' ')
      .map((num) => +num)
    if (type === 'Time') {
      valueArray.forEach((val) => races.push({ time: val, distance: 0 }))
    } else if (type === 'Distance') {
      valueArray.forEach((val, idx) => (races[idx].distance = val))
    }
  }
})

file.on('close', () => {
  let multiples = 1
  for (let { time, distance } of races) {
    let numberOfRecordsBroken = 0
    for (let pressTime = 1; pressTime < time; pressTime += 1) {
      const timeRemaining = time - pressTime
      const distanceCovered = pressTime * timeRemaining
      if (distanceCovered > distance) {
        numberOfRecordsBroken += 1
      }
    }
    multiples *= numberOfRecordsBroken
  }
  console.log('Part 1 =', multiples)
})
