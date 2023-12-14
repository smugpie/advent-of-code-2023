import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./input.txt')
})

let mirrors: string[][] = [[]]
let currentMirror = 0

file.on('line', (line: string) => {
  if (line === '') {
    currentMirror += 1
    mirrors.push([])
  } else {
    mirrors[currentMirror].push(line)
  }
})

const transposeMirror = function (mirror: string[]): string[] {
  const newMirror: string[] = Array(mirror[0].length).fill('')
  for (let i = 0; i < newMirror.length; i += 1) {
    for (let j = 0; j < mirror.length; j += 1) {
      newMirror[i] = `${newMirror[i]}${mirror[j][i]}`
    }
  }
  return newMirror
}

const findDifferentCharacters = function (s1: string, s2: string): number {
  let sum = 0
  for (let i = 0; i < s1.length; i += 1) {
    if (s1[i] !== s2[i]) sum += 1
  }
  return sum
}

const findSymmetry = function (mirror: string[]): number {
  for (let i = 1; i < mirror.length; i += 1) {
    let up = i - 1
    let down = i

    let differences = 0
    while (up >= 0 && down < mirror.length) {
      differences += findDifferentCharacters(mirror[up], mirror[down])
      up -= 1
      down += 1
    }

    if (differences === 1) {
      return i
    }
  }
  return -1
}

file.on('close', () => {
  let sum = 0
  mirrors.forEach((mirror) => {
    let pointFound = findSymmetry(mirror)
    if (pointFound > 0) sum += (100 * pointFound)

    const newMirror = transposeMirror(mirror)
    pointFound = findSymmetry(newMirror)
    if (pointFound > 0) sum += pointFound
  })
  console.log('Part 2 =', sum)
})
