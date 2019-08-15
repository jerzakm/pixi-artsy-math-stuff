import { Container, Graphics } from "pixi.js"
import * as Color from 'color'
import { Point, polarCoords } from "../math/coordMath";

export class LissajousTable extends Container {
    options: ILissajousTableOptions
    xPointCircles: number[]
    yPointCircles: number[]
    g: Graphics
    color?: Color
    canvasContext?: CanvasRenderingContext2D | null

    constructor(options: ILissajousTableOptions) {
        super()
        this.options = options
        this.xPointCircles = []
        this.yPointCircles = []
        this.g = new Graphics()
        this.addChild(this.g)
        this.setup()
    }

    private setup() {
        for (let i = 0; i < this.options.gridSize; i++) {
            this.xPointCircles.push(0)
            this.yPointCircles.push(0)
        }
        this.canvasContext = this.options.helperCanvas.getContext('2d')
        this.color = Color.rgb(200, 30, 0)
        this.options.cellMargin = this.options.cellSize / 4
        this.options.leadingCircleR = this.options.cellSize / 2
    }

    public animate() {
        for (let i = 0; i < this.xPointCircles.length; i++) {
            this.xPointCircles[i] += this.options.rotationSpeed * (i + 1)
            this.yPointCircles[i] += this.options.rotationSpeed * (i + 1)
        }

        this.g.clear()

        if (this.color) {
            this.color = this.color.rotate(this.options.rotationSpeed * 10)
        }

        this.drawLeadingCircles(this.options)
        this.drawGrid(this.options)
        this.drawPointCircles(this.options)
    }

    private drawLeadingCircles({ gridSize, cellSize, cellMargin, leadingCircleR }: ILissajousTableOptions) {
        this.g.lineStyle(1, 0xAAAAAA)

        if (cellMargin && leadingCircleR) {
            for (let i = 0; i < gridSize; i++) {
                this.g.drawCircle(i * (cellSize + cellMargin) + (cellSize + cellMargin), 0, leadingCircleR)
                this.g.drawCircle(0, i * (cellSize + cellMargin) + (cellSize + cellMargin), leadingCircleR)
            }
        } else {
            console.log(`
            drawing circles error:
            cellMargin: ${cellMargin ? 'true' : 'false'}
            leadingCircleR: ${leadingCircleR ? 'true' : 'false'}
            `)
        }
    }

    private drawGrid({ gridSize, cellSize, cellMargin }: ILissajousTableOptions) {
        this.g.lineStyle(1, 0x333333)
        if (cellMargin) {
            for (let i = 0; i <= gridSize; i++) {
                this.g.drawRect(i * (cellSize + cellMargin) + cellSize / 2 + cellMargin / 2, 0, 1, gridSize * (cellSize + cellMargin) + (cellSize + cellMargin))
                this.g.drawRect(0, i * (cellSize + cellMargin) + cellSize / 2 + cellMargin / 2, gridSize * (cellSize + cellMargin) + (cellSize + cellMargin), 1)
            }
        }
    }

    private drawPointCircles({ gridSize, leadingCircleR, cellSize, cellMargin, pointCircleR }: ILissajousTableOptions) {
        if (leadingCircleR && cellMargin && this.canvasContext && this.color) {
            this.g.lineStyle(1, 0xFFFFFF, 0.2)
            const testPoints: Point[][] = []

            for (let x = 0; x < gridSize; x++) {
                testPoints[x] = []
                for (let y = 0; y < gridSize; y++) {
                    testPoints[x][y] = { x: 0, y: 0 }
                }
            }


            for (let x = 0; x < gridSize; x++) {
                //X
                const xCoord = polarCoords(leadingCircleR, this.xPointCircles[x])
                const drawPointX = x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x
                this.g.beginFill(0xFFFFFF)
                this.g.drawCircle(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y, pointCircleR)
                this.g.endFill()
                this.g.moveTo(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y)
                this.g.lineTo(x * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)))
                // g.drawRect(i * (cellSize + cellMargin) + (cellSize + cellMargin) + xCoord.x, 0 + xCoord.y, 1, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - xCoord.y)
                for (let y = 0; y < gridSize; y++) {
                    testPoints[y][x].x = drawPointX
                }
            }

            for (let x = 0; x < gridSize; x++) {
                //Y
                const yCoord = polarCoords(leadingCircleR, this.yPointCircles[x])
                const drawPointY = x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y
                this.g.beginFill(0xFFFFFF)
                this.g.drawCircle(0 + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y, pointCircleR)
                this.g.endFill()
                this.g.moveTo(0 + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y)
                this.g.lineTo((gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - yCoord.x + yCoord.x, x * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y)
                // g.drawRect(0 + yCoord.x, i * (cellSize + cellMargin) + (cellSize + cellMargin) + yCoord.y, (gridSize * (cellSize + cellMargin) + (cellSize + cellMargin)) - xCoord.x, 0.5)
                for (let y = 0; y < gridSize; y++) {
                    testPoints[x][y].y = drawPointY
                }
            }



            for (const x of testPoints) {
                for (const drawingPoint of x) {
                    this.g.drawCircle(drawingPoint.x, drawingPoint.y, 2)
                    this.canvasContext.fillStyle = this.color.hex()
                    this.canvasContext.fillRect(drawingPoint.x + this.position.x + this.g.position.x, drawingPoint.y + this.position.y + this.g.position.y, 1, 1)
                }
            }
            this.g.endFill()
        } else {
            console.log('drawing point circles error')
        }
    }
}

export interface ILissajousTableOptions {
    gridSize: number,
    cellSize: number,
    pointCircleR: number,
    cellMargin?: number,
    leadingCircleR?: number,
    helperCanvas: HTMLCanvasElement,
    rotationSpeed: number
}