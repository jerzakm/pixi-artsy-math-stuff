import { Container, Graphics } from "pixi.js";
import { circlesIntersect } from "../math/circleMath";


export class CirclePacking extends Container {
  circles: Circle[]
  g: Graphics
  lastPop: number
  popFrequency: number
  popLimit: number | undefined


  constructor() {
    super()
    this.circles = []
    this.g = new Graphics()
    this.addChild(this.g)
    this.lastPop = 1
    this.popFrequency = 1
    this.popLimit = 5
  }

  public animate(delta: number) {
    this.g.clear()
    this.g.lineStyle(2, 0xFFFFFF)//

    for (const circle of this.circles) {
      this.g.drawCircle(circle.x, circle.y, circle.r)

      const c1 = { x: circle.x, y: circle.y, r: circle.r }
      let intersect = false
      for (const c of this.circles) {
        const c2 = { x: c.x, y: c.y, r: c.r }
        if (c1.x != c2.x && c1.y != c2.y) {
          intersect = circlesIntersect(c1, c2)
        }
        if (intersect) {
          break;
        }
      }

      if (!intersect) {
        circle.grow()
      }
    }

    if (this.lastPop > this.popFrequency) {
      this.populate()
      this.lastPop = 0
    } else {
      this.lastPop += delta
    }
  }

  private populate() {
    if (this.popLimit && this.circles.length < this.popLimit) {
      const x = Math.random() * screen.width
      const y = Math.random() * screen.height
      this.circles.push(
        new Circle(x, y, 1)
      )
    }
    console.log(this.circles.length)
  }
}

class Circle {
  x: number
  y: number
  r: number

  constructor(x: number, y: number, r: number) {
    this.x = x
    this.y = y
    this.r = r
  }

  public grow(growBy?: number) {
    const step = growBy ? growBy : 1
    this.r += step
  }
}