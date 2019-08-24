import { Container, Graphics } from "pixi.js";
import { discreteFourierTransform, IFourierTransform } from "../math/fourier";
import { Point } from "../math/coordMath";
import { drawing } from "./test";

export class FourierDrawing extends Container {
  g: Graphics
  angl: number
  path: Point[]
  fourierX: IFourierTransform[]
  fourierY: IFourierTransform[]

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.angl = 0
    this.path = []
    const x: number[] = []
    const y: number[] = []
    const d = drawing
    const step = 5
    for (let i = 0; i < d.length; i += step) {
      x.push(d[i].x)
      y.push(d[i].y)
    }
    this.fourierX = discreteFourierTransform(x)
    this.fourierY = discreteFourierTransform(y)
    this.fourierX.sort((a, b) => b.amp - a.amp)
    this.fourierY.sort((a, b) => b.amp - a.amp)
  }

  public animate(delta: number) {
    this.g.clear()

    const step = (2 * Math.PI) / this.fourierY.length
    this.angl += step


    this.g.lineStyle(1, 0xFFFFFF)

    const start = { xx: 600, xy: 0, yx: 100, yy: 300 }

    const vx = this.epicycle(start.xx, start.xy, 0, this.fourierX)
    const vy = this.epicycle(start.yx, start.yy, Math.PI / 2, this.fourierY)
    const drawPoint = {
      x: vx.x,
      y: vy.y
    }

    this.path.push(drawPoint)

    // this.path.length > 500 ? this.path.pop() : false

    this.g.beginFill(0xFFAA12)
    this.g.drawCircle(vx.x, vx.y, 5)
    this.g.drawCircle(vy.x, vy.y, 5)
    this.g.endFill()

    // const lineShift = 2 * 160

    let started = false

    this.g.lineStyle(1, 0xAAAAAA)
    for (const point of this.path) {
      if (!started) {
        started = true
        this.g.moveTo(point.x, point.y)
      }
      this.g.lineTo(point.x, point.y)
    }
  }

  private epicycle(x: number, y: number, rotation: number, fourier: IFourierTransform[]) {
    const point = {
      x: x,
      y: y
    }

    for (let i = 0; i < fourier.length; i++) {
      let freq = fourier[i].freq
      const r = fourier[i].amp
      this.g.drawCircle(point.x, point.y, r)

      point.x += r * Math.cos(freq * this.angl + fourier[i].phase + rotation)
      point.y += r * Math.sin(freq * this.angl + fourier[i].phase + rotation)
    }

    return point
  }
}