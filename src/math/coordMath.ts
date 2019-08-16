export const polarCoords = (r: number, angle: number) => {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
    }
}

export const distanceBetweenPoints = (p1: Point, p2: Point) => {
    return Math.sqrt(((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2))
}

export const findPointWithAngle = (from: Point, angle: number, distance: number): Point => {
    return {
        x: Math.round(Math.cos(angle * Math.PI / 360) * distance + from.x),
        y: Math.round(Math.sin(angle * Math.PI / 360) * distance + from.y)      
    }
}

export interface Point {
    x: number,
    y: number
}