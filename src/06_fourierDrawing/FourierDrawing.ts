import { Container, Graphics } from "pixi.js";
import { discreteFourierTransform } from "../math/fourier";

export class FourierDrawing extends Container {
  g: Graphics
  angl: number
  wave: number[]

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.angl = 0
    this.wave = []
  }

  public animate(delta: number) {
    this.g.clear()
    this.angl += 0.001

    const point = {
      x: 0,
      y: 0
    }

    const f = 10

    this.g.lineStyle(1, 0xFFFFFF)

    for (let i = 0; i < f; i++) {
      let prevx = point.x
      let prevy = point.y
      let n = i * 2 + 1
      const r = 160 * (4 / (n * Math.PI))
      this.g.drawCircle(point.x, point.y, r)

      point.x += r * Math.cos(n * this.angl)
      point.y += r * Math.sin(n * this.angl)

      i + 1 == f ? this.wave.unshift(point.y) : false
    }

    this.wave.length > 800 ? this.wave.pop() : false

    this.g.beginFill(0xFFAA12)
    this.g.drawCircle(point.x, point.y, 5)
    this.g.endFill()

    const lineShift = 2 * 160

    this.g.moveTo(point.x, point.y)
    this.g.lineStyle(1, 0xAAAAAA)
    for (let i = 0; i < this.wave.length; i++) {
      this.g.lineTo(i + lineShift, this.wave[i])
      // this.g.drawRect(i, this.wave[i], 1, 1)
    }

  }
}