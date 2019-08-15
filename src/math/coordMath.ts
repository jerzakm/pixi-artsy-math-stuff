export const polarCoords = (r: number, angle: number) => {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
    }
}

export const distanceBetweenPoints = (p1: Point, p2: Point) => {
    return Math.sqrt(((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2))
}

export interface Point {
    x: number,
    y: number
}