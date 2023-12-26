import * as fs from 'fs'
import * as readline from 'readline'

var file = readline.createInterface({
  input: fs.createReadStream('./testinput.txt')
})

type Coord = [number, number]
type Path = [Coord[], string[]]
type CalculatedPath = [Path, number]
const grid: number[][] = []
const pathsToCheck: Path[] = []
const heatLosses: CalculatedPath[][] = []
let optimalRoute: CalculatedPath

file.on('line', (line) => {
  grid.push(line.split('').map((num) => +num))
  heatLosses.push(new Array(line.length))
})

const isValidPath = function (pathString: string): boolean {
  return !/(uuuu|dddd|llll|rrrr)/.test(pathString)
}

const areValidPaths = function (pathStrings: string[], newDir: string): boolean {
  console.log(areValidPaths);
  for (let i = 0; i < pathStrings.length; i += 1) {
    if (isValidPath(`${pathStrings[i]}${newDir}`)) {
      return true
    }
  }
  return false
}

let ct = 0

const checkPaths = function (): CalculatedPath {
  console.log('yy')
  while (pathsToCheck.length > 0) {
    const currentPath = pathsToCheck.shift()!
    addNewPaths(currentPath)
    ct += 1
    console.log(ct)
  }
  return optimalRoute
}

const addNewPaths = function (path: Path) {
  const [coords, pathString] = path
  //console.log(pathString)
  const [y, x] = coords.at(-1)!
  // up
  if (y > 0) {
    checkNewPath(path, y - 1, x, `u`)
  }
  // left
  if (x > 0) {
    checkNewPath(path, y, x - 1, `l`)
  }
  // right
  if (x < grid[0].length - 1) {
    checkNewPath(path, y, x + 1, `r`)
  }

  // down
  if (y < grid.length - 1) {
    checkNewPath(path, y + 1, x, `d`)
  }
}

const calculateHeatLoss = function (path: Path): number {
  const [coords] = path
  const calcCoords = [...coords]
  calcCoords.shift()
  return calcCoords.reduce((acc, [y, x]) => (acc += grid[y][x]), 0)
}

const checkNewPath = function (
  path: Path,
  newY: number,
  newX: number,
  newDir: string
) {
  console.log('checking', path, newY, newX, newDir)
  const [coords, pathStrings] = path
  const updatedPath: Path = [
    [...coords, [newY, newX]],
    pathStrings.map(ps => `${ps}${newDir}`)
  ]
  // have we reached the end
  if (newY === grid.length - 1 && newX === grid[grid.length - 1].length - 1) {
    registerOptimalRoute([updatedPath, calculateHeatLoss(path)])
    return
  }

  const newHeatLoss = calculateHeatLoss(updatedPath)
  let oldHeatloss = Infinity
  if (typeof heatLosses[newY][newX] !== 'undefined') {
    ;[, oldHeatloss] = heatLosses[newY][newX]
  }

  const testValidPaths = areValidPaths(pathStrings, newDir)
  if (oldHeatloss > newHeatLoss && testValidPaths) {
    heatLosses[newY][newX] = [updatedPath, newHeatLoss]
    pathsToCheck.push(updatedPath)
  } else if (oldHeatloss === newHeatLoss && testValidPaths) {
    const [path] = heatLosses[newY][newX]
    const [coords, oldPathStrings] = updatedPath
    heatLosses[newY][newX] = [[coords, [...oldPathStrings]], oldHeatloss]
  }
}

const registerOptimalRoute = function (calculatedPath: CalculatedPath): void {
  let optimalHeatLoss = Infinity
  if (optimalRoute) [, optimalHeatLoss] = optimalRoute
  const [, heatLoss] = calculatedPath
  if (heatLoss < optimalHeatLoss) {
  }

  file.on('close', () => {
    pathsToCheck.push([[[0, 0]], ['S']])
    checkPaths()
    const [path, heatLoss] = optimalRoute
    const [, pathStrings] = path
    console.log('Part 1: least heat loss =', heatLoss)
    console.log(pathStrings)
  })
