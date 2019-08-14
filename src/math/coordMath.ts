export const polarCoords = (r: number, angle: number) => {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
    }
}

export interface Point {
    x: number,
    y: number
}