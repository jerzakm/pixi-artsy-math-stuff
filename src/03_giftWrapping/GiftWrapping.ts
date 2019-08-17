import { Container, Graphics, Text } from "pixi.js";
import { Point, findPointWithAngle, calcAngleBetweenPoints } from "../math/coordMath";
import { Line } from "../math/shapes";
import { vectorCrossProduct, vectorSubtract } from "../math/vectorMath";

export class GiftWrapping extends Container {
    points: Point[]
    maxWidth: number
    maxHeight: number
    pointCount: number

    leftMost: Point
    currentVertex: Point
    index: number
    nextIndex: number
    nextVertex: Point
    hull: Point[]

    g: Graphics
    lastWrap: number
    wrapSearchLine: Line

    constructor(maxWidth: number, maxHeight: number, pointCount: number) {
        super()
        this.points = []
        this.maxWidth = maxWidth
        this.maxHeight = maxHeight
        this.pointCount = pointCount
        this.g = new Graphics()

        this.wrapSearchLine = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
        this.lastWrap = 0


        this.addChild(this.g)
        this.populate()
        this.hull = []
        this.leftMost = this.findLeftmost()

        this.nextIndex = -1
        this.currentVertex = this.leftMost
        this.hull.push(this.currentVertex)
        this.nextVertex = this.points[1]
        this.index = 2
    }

    private populate() {
        for (let i = 0; i < this.pointCount; i++) {
            this.points.push({
                x: Math.floor(Math.random() * this.maxWidth),
                y: Math.floor(Math.random() * this.maxHeight),
            })
        }
    }

    public animate(delta: number) {
        this.lastWrap > 1 ? this.wrap() : this.lastWrap += delta

        this.g.clear()
        this.drawPoints()
        this.drawHull()
        this.drawSearchLine()
    }

    private findLeftmost() {
        this.points = this.points.sort((a, b) => {
            return a.x - b.x
        })
        return this.points[0]
    }

    private drawPoints() {
        this.g.beginFill(0xFFFFFF)
        for (const point of this.points) {
            this.g.drawCircle(point.x, point.y, 3)
        }
        this.g.endFill()
    }

    private drawHull() {
        this.g.lineStyle(2, 0xFF1212)
        for (const point of this.hull) {
            this.g.drawCircle(point.x, point.y, 7)
        }
        this.g.lineStyle(0)
    }

    private drawSearchLine() {
        this.g.lineStyle(2, 0x99FF99)
        this.g.moveTo(this.wrapSearchLine.from.x, this.wrapSearchLine.from.y)
        this.g.lineTo(this.wrapSearchLine.to.x, this.wrapSearchLine.to.y)
        this.g.lineStyle(0)
    }

    private wrap() {
        this.lastWrap = 0

        let checking = this.points[this.index]
        this.wrapSearchLine = {
            from: {
                x: this.currentVertex.x,
                y: this.currentVertex.y
            },
            to: {
                x: checking.x,
                y: checking.y
            }
        }

        const a = vectorSubtract(
            {
                x: this.nextVertex.x,
                y: this.nextVertex.y,
                z: 0
            },
            {
                x: this.currentVertex.x,
                y: this.currentVertex.y,
                z: 0
            },
        )
        const b = vectorSubtract(
            {
                x: checking.x,
                y: checking.y,
                z: 0
            },
            {
                x: this.currentVertex.x,
                y: this.currentVertex.y,
                z: 0
            },
        )
        const cross = vectorCrossProduct(a, b)
        console.log(cross)

        if (cross.z < 0) {
            this.nextVertex = checking
            this.nextIndex = this.index
        }
        this.index += 1;
        if (this.index == this.points.length) {
            if (this.nextVertex == this.leftMost) {
                console.log('done');
            } else {
                this.hull.push(this.nextVertex);
                this.currentVertex = this.nextVertex;
                this.index = 0;
                this.nextVertex = this.leftMost;
            }
        }
    }
}