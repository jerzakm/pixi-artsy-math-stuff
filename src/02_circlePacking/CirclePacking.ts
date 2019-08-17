import { Container, Graphics } from "pixi.js";
import { circlesIntersect } from "../math/circleMath";


export class CirclePacking extends Container {
  circles: Circle[]
  // staticG: Graphics
  g: Graphics
  lastPop: number
  popFrequency: number
  popLimit: number | undefined


  constructor() {
    super()
    this.circles = []
    this.lastPop = 1
    this.popFrequency = 1
    this.popLimit = 500
    this.g = new Graphics()
    this.addChild(this.g)
  }

  public animate(delta: number) {
    for (const circle of this.circles) {
      if (circle.canGrow) {
        const c1 = { x: circle.x, y: circle.y, r: circle.r }
        let intersect = false
        for (const c of this.circles) {
          const c2 = { x: c.x, y: c.y, r: c.r }
          if (c1.x != c2.x && c1.y != c2.y) {
            intersect = circlesIntersect(c1, c2)
          }
          if (intersect) {
            circle.canGrow = false
            break;
          }
        }
        if (!intersect) {
          circle.grow(2)
        }
      }
    }


    if (this.lastPop > this.popFrequency) {
      if (this.popLimit && this.circles.length < this.popLimit) {
        this.populate()
      }
      this.lastPop = 0
    } else {
      this.lastPop += delta
    }

    this.g.beginFill(0xFFFFFF)
    this.g.lineStyle(2, 0x121212)
    this.g.clear()
    for (const circle of this.circles) {
      this.g.drawCircle(circle.x, circle.y, circle.r)
    }
    this.g.endFill()
  }

  private populate() {
    // console.log(this.circles)
    //todo - add different strategy for picking a free spot when random regression becomes too expensive
    if (this.popLimit && this.circles.length < this.popLimit) {
      const x = Math.random() * screen.width
      const y = Math.random() * screen.height

      const c1 = { x: x, y: y, r: 1 }

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
        this.circles.push(
          new Circle(x, y, 1)
        )
      } else {
        this.populate()
      }
    }
  }
}

class Circle {
  x: number
  y: number
  r: number
  canGrow: boolean

  constructor(x: number, y: number, r: number) {
    this.x = x
    this.y = y
    this.r = r
    this.canGrow = true
  }

  public grow(growBy?: number) {
    const step = growBy ? growBy : 1
    this.r += step
  }
}