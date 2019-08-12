import Viewport from "pixi-viewport"
import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import * as Color from 'color'
import { Container, Graphics } from "pixi.js";

renderer.initRenderer()

const gridSize = 64


const cellSize = 60
const cellMargin = cellSize / 4

const leadingCircleR = cellSize / 2
const pointCircleR = 5

const rotationSpeed = 0.003

const xPointCircles: number[] = []
const yPointCircles: number[] = []

const curves: boolean[][] = []

const graphicsContainer = new Container()

const g = new Graphics()
g.position.x = 50
g.position.y = 50
renderer.stage.addChild(g)

var stats = new Stats.default();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

for (let i = 0; i < gridSize; i++) {
    xPointCircles.push(0)
    yPointCircles.push(0)
}

for (let x = 0; x < gridSize * (cellSize + cellMargin); x++) {
    curves[x] = []
    for (let y = 0; y < gridSize * (cellSize + cellMargin); y++) {
        curves[x][y] = false
    }
}

const shapeCanvas = document.createElement('canvas')
document.body.appendChild(shapeCanvas)
shapeCanvas.width = renderer.renderer.width
shapeCanvas.height = renderer.renderer.height
shapeCanvas.style.position = 'fixed'
shapeCanvas.style.top = '0'
shapeCanvas.style.left = '0'

const context = shapeCanvas.getContext('2d')


let color = Color.rgb(200, 30, 0)

renderer.ticker.add((delta) => {
    stats.begin()

    for (let i = 0; i < xPointCircles.length; i++) {
        xPointCircles[i] += rotationSpeed * (i + 1)
        yPointCircles[i] += rotationSpeed * (i + 1)
    }

    g.clear()

    drawLeadingCircles()
    drawGrid()
    drawPointCircles()
    // drawCurves()
    color = color.rotate(0.05)


    stats.end()
})

// function animate() {
//     stats.begin()

//     for (let i = 0; i < xPointCircles.length; i++) {
//         xPointCircles[i] += rotationSpeed * (i + 1) //* Math.sin(Math.PI / (i + 1))
//         yPointCircles[i] += rotationSpeed * (i + 1)
//     }

//     g.clear()

//     drawLeadingCircles()
//     drawGrid()
//     drawPointCircles()
//     // drawCurves()
//     color = color.rotate(0.05)


//     stats.end()

//     requestAnimationFrame(animate);

// }
// requestAnimationFrame(animate);

function drawLeadingCircles() {
    g.lineStyle(1, 0xAAAAAA)
    for (let i = 0; i < gridSize; i++) {
        g.drawCircle(i * (cellSize + cellMargin) + (cellSize + cellMargin), 0, leadingCircleR)
        g.drawCircle(0, i * (cellSize + cellMargin) + (cellSize + cellMargin), leadingCircleR)
    }
}

function drawGrid() {
    g.lineStyle(1, 0x333333)
    for (let i = 0; i <= gridSize; i++) {
        g.drawRect(i * (cellSize + cellMargin) + cellSize / 2 + cellMargin / 2, 0, 1, gridSize * (cellSize + cellMargin) + (cellSize + cellMargin))
        g.drawRect(0, i * (cellSize + cellMargin) + cellSize / 2 + cellMargin / 2, gridSize * (cellSize + cellMargin) + (cellSize + cellMargin), 1)
    }
}

function drawPointCircles() {
    g.lineStyle(1, 0xFFFFFF, 0.5)

    const testPoints: Point[][] = []

    for (let x = 0; x < gridSize; x++) {
        testPoints[x] = []
        for (let y = 0; y < gridSize; y++) {
            testPoints[x][y] = { x: 0, y: 0 }
        }
    }


    for (let x = 0; x < gridSize; x++) {
        //X
        const xCoord = polarCoords(leadingCircleR, xPointCircles[x])
        const drawPointX = x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x
        g.beginFill(0xFFFFFF)
        g.drawCircle(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y, pointCircleR)
        g.endFill()
        g.moveTo(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y)
        g.lineTo(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)))
        // g.drawRect(i * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y, 1, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - xCoord.y)
        for (let y = 0; y < gridSize; y++) {
            testPoints[y][x].x = drawPointX
        }
    }

    for (let x = 0; x < gridSize; x++) {
        //Y
        const yCoord = polarCoords(leadingCircleR, yPointCircles[x])
        const drawPointY = x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y
        g.beginFill(0xFFFFFF)
        g.drawCircle(0 + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y, pointCircleR)
        g.endFill()
        g.moveTo(0 + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y)
        g.lineTo((gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - yCoord.x + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y)
        // g.drawRect(0 + yCoord.x, i * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - xCoord.x, 0.5)
        for (let y = 0; y < gridSize; y++) {
            testPoints[x][y].y = drawPointY
        }
    }



    for (const x of testPoints) {
        for (const drawingPoint of x) {
            g.drawCircle(drawingPoint.x, drawingPoint.y, 2)
            context.fillStyle = color.hex()
            context.fillRect(drawingPoint.x + g.position.x, drawingPoint.y + g.position.y, 1, 1)
        }
    }
    g.endFill()
}

function polarCoords(r: number, angle: number) {
    return {
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
    }
}


interface Point {
    x: number,
    y: number
}

interface Curve {
    points: Point[]
}