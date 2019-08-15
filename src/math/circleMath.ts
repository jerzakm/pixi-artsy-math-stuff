import { Circle } from "./shapes";
import { distanceBetweenPoints } from "./coordMath";

export const circlesIntersect = (circle1: Circle, circle2: Circle) => {
  return distanceBetweenPoints({ x: circle1.x, y: circle1.y }, { x: circle2.x, y: circle2.y }) < circle1.r + circle2.r ? true : false
}