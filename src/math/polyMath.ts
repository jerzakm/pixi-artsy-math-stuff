import { Vector } from "matter-js";


export const calcPolygonPoints = (faces: number, radius: number, angle = 0, position = { x: 0, y: 0 }) => {
  const points: Vector[] = []


  for (let i = 0; i < faces; i++) {
    points.push({
      x: position.x + radius * Math.cos(2 * Math.PI * (i / faces + angle)),
      y: position.y + radius * Math.sin(2 * Math.PI * (i / faces + angle))
    })
  }

  return points
}