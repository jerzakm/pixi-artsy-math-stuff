export const vectorCrossProduct = (a: Vector, b: Vector): Vector => {
  const x = a.y * b.z - a.z * b.y;
  const y = a.z * b.x - a.x * b.z;
  const z = a.x * b.y - a.y * b.x;
  return {
    x: x,
    y: y,
    z: z
  }
}

export const vectorSubtract = (a: Vector, b: Vector): Vector => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z
  }
}

export interface Vector {
  x: number,
  y: number,
  z: number
}