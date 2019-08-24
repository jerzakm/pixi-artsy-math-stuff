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
    const r = 100
    this.g.clear()
    this.g.lineStyle(2, 0xFFFFFF)
    this.g.drawCircle(0, 0, r)

    const point = {
      x: r * Math.cos(this.angl),
      y: r * Math.sin(this.angl)
    }

    this.wave.unshift(point.y)
    this.wave.length > 800 ? this.wave.pop() : false

    this.g.moveTo(0, 0)
    this.g.lineTo(point.x, point.y)

    this.g.lineStyle(0)

    this.angl += 0.03
    this.g.beginFill(0xFFAA12)
    this.g.drawCircle(point.x, point.y, 5)
    this.g.endFill()

    const lineShift = 2 * r

    this.g.moveTo(point.x, point.y)
    this.g.lineStyle(1, 0xAAAAAA)
    for (let i = 0; i < this.wave.length; i++) {
      this.g.lineTo(i + lineShift, this.wave[i])
      // this.g.drawRect(i, this.wave[i], 1, 1)
    }

  }
}