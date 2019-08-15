import { Point } from "./coordMath";

export interface Line {
    from: Point,
    to: Point
}

export interface Circle {
    x: number
    y: number
    r: number
}