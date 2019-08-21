import { Container, Graphics } from "pixi.js";
import { Point, findPointWithAngle, isPointInLineSegment } from "../math/coordMath";

export class Windmill extends Container {
  points: Point[]
  pointCount: number
  maxWidth: number
  maxHeight: number

  g: Graphics

  lineAngle: number
  index: number

  constructor(pointCount: number) {
    super()
    this.pointCount = pointCount
    this.points = []
    this.g = new Graphics()
    this.addChild(this.g)
    this.lineAngle = 90
    this.index = Math.ceil(this.pointCount / 2)
    this.maxHeight = 500
    this.maxWidth = 900

    this.populate()
  }

  private populate() {
    for (let i = 0; i < this.pointCount; i++) {
      this.points.push({
        x: Math.floor(Math.random() * this.maxWidth),
        y: Math.floor(Math.random() * this.maxHeight),
      })
    }
    this.points = this.points.sort((a, b) => {
      return a.x - b.x
    })
  }

  public animate(delta: number) {
    this.g.clear()
    this.drawPoints()
    this.drawLine()
    this.lineAngle >= 360 ? this.lineAngle = 0 : this.lineAngle += 0.1
  }

  private drawPoints() {
    this.g.beginFill(0xFFaaaa)
    for (const point of this.points) {
      this.g.drawCircle(point.x, point.y, 5)
    }
    this.g.endFill()
  }

  private drawLine() {
    this.g.lineStyle(2, 0x12FFaa)
    const center = this.points[this.index]
    const from = findPointWithAngle(center, this.lineAngle - 180, 1000)
    const to = findPointWithAngle(center, this.lineAngle, 1000)
    this.g.moveTo(from.x, from.y)
    this.g.lineTo(to.x, to.y)
    this.g.lineStyle(0)
    for (let i = 0; i < this.points.length; i++) {
      if (i != this.index) {
        const hit = calcIsInsideThickLineSegment(from, to, this.points[i], 2)
        if (hit) {
          console.log(hit)
          this.index = i
          break
        }
      }
    }
  }
}

function calcIsInsideThickLineSegment(line1, line2, pnt, lineThickness) {
  var L2 = (((line2.x - line1.x) * (line2.x - line1.x)) + ((line2.y - line1.y) * (line2.y - line1.y)));
  if (L2 == 0) return false;
  var r = (((pnt.x - line1.x) * (line2.x - line1.x)) + ((pnt.y - line1.y) * (line2.y - line1.y))) / L2;

  //Assume line thickness is circular
  if (r < 0) {
    //Outside line1
    return (Math.sqrt(((line1.x - pnt.x) * (line1.x - pnt.x)) + ((line1.y - pnt.y) * (line1.y - pnt.y))) <= lineThickness);
  } else if ((0 <= r) && (r <= 1)) {
    //On the line segment
    var s = (((line1.y - pnt.y) * (line2.x - line1.x)) - ((line1.x - pnt.x) * (line2.y - line1.y))) / L2;
    return (Math.abs(s) * Math.sqrt(L2) <= lineThickness);
  } else {
    //Outside line2
    return (Math.sqrt(((line2.x - pnt.x) * (line2.x - pnt.x)) + ((line2.y - pnt.y) * (line2.y - pnt.y))) <= lineThickness);
  }
}