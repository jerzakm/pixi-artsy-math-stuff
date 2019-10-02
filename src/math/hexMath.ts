import { Point } from "./coordMath"

export const calcHexPoints = (r: number, h: number, flat: boolean): number[] => {
  if (flat) {
    return [-r, 0, -r / 2, h / 2, r / 2, h / 2, r, 0, r / 2, -h / 2, -r / 2, -h / 2]
  } else {
    return [-h / 2, r / 2, 0, r, h / 2, r / 2, h / 2, -r / 2, 0, -r, -h / 2, -r / 2]
  }
}

export const calcHexLocation = (i: number, j: number, r: number, h: number, flat: boolean): Point => {
  let loc = {
    x: 0,
    y: 0
  }
  if (flat) {
    loc.x = i * 1.5 * r;
  } else {
    loc.x = i * h;
    if (j % 2 == 0) {
      loc.x -= h / 2;
    }
  }
  if (flat) {
    loc.y = j * h;
    if (i % 2 != 0) {
      loc.y = j * h + 0.5 * h;
    }
  } else {
    loc.y = j * r + j * r / 2;
  }
  return loc;
}

interface OddqNeighbours {
  core: number[]
  array: number[][]
  N: number[]
  NW: number[]
  NE: number[]
  S: number[]
  SW: number[]
  SE: number[]
}

export const oddqNeighbours = (col: number, row: number): OddqNeighbours => {
  const N = [col, row - 1]
  const NW = [row - 1, col]
  const NE = [row + 1, col]
  const S = [row, col + 1]
  const SW = [row + 1, col - 1]
  const SE = [row + 1, col + 1]
  return {
    core: [row, col],
    array: [N, NW, NE, S, SW, SE],
    N: N,
    NW: NW,
    NE: NE,
    S: S,
    SW: SW,
    SE: SE
  }
}

export interface HexCubeCoordinates {
  x: number
  y: number
  z: number
}

export interface CubeNeighbours {
  N: HexCubeCoordinates
  NW: HexCubeCoordinates
  NE: HexCubeCoordinates
  S: HexCubeCoordinates
  SE: HexCubeCoordinates
  SW: HexCubeCoordinates
  array: HexCubeCoordinates[]
}

export const cubeNeighbours = (cube: HexCubeCoordinates) => {
  let N = { x: cube.x, y: cube.y + 1, z: cube.z - 1 }
  let NW = { x: cube.x - 1, y: cube.y + 1, z: cube.z }
  let NE = { x: cube.x + 1, y: cube.y, z: cube.z - 1 }
  let S = { x: cube.x, y: cube.y - 1, z: cube.z + 1 }
  let SW = { x: cube.x - 1, y: cube.y, z: cube.z + 1 }
  let SE = { x: cube.x + 1, y: cube.y - 1, z: cube.z }
  return {
    N: N,
    NW: NW,
    NE: NE,
    S: S,
    SE: SE,
    SW: SE,
    array: [N, NW, NE, S, SW, SE]
  }
}

export const oddqToCube = (col: number, row: number): HexCubeCoordinates => {
  const x = col
  const z = row - (col - (col & 1)) / 2
  return {
    x: x,
    z: z,
    y: -x - z
  }
}

export interface HexGridCoordinates {
  col: number
  row: number
}

export const cubeToOddq = (cube: HexCubeCoordinates): HexGridCoordinates => {
  return {
    col: cube.x,
    row: cube.z + (cube.x - (cube.x & 1)) / 2
  }
}