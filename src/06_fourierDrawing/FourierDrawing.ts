import { Container, Graphics, interaction } from "pixi.js";
import { discreteFourierTransform, IFourierTransform } from "../math/fourier";
import { Point } from "../math/coordMath";
import { drawing } from "./test";

export class FourierDrawing extends Container {
  g: Graphics
  angl: number
  drawing: Point[]
  path: Point[]
  fourierX: IFourierTransform[]
  fourierY: IFourierTransform[]
  debugCircles: Point[]

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.angl = 0
    this.drawing = []
    this.path = []
    this.fourierX = []
    this.fourierY = []

    this.debugCircles = []

    this.setup()
  }

  private setup() {
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

    this.interactive = true
    this.buttonMode = true
    this
      .on('pointerdown', this.drawStart)
      .on('pointerup', this.drawEnd)
      .on('pointerupoutside', this.drawEnd)
      .on('pointermove', this.drawMove)
  }

  private drawDebugCircles() {
    this.g.beginFill(0xAAFF88, 0.3)
    for (const debugCircle of this.debugCircles) {
      this.g.drawCircle(debugCircle.x, debugCircle.y, 20)
    }
    this.g.endFill()
  }

  private drawStart(event: interaction.InteractionEvent) {
    console.log('started drawing')
    this.debugCircles.push(event.data.getLocalPosition(this.g))
    console.log(this.debugCircles)
  }

  private drawMove() {
    console.log('moving drawiing')
  }

  private drawEnd() {
    console.log('drawing ended')
  }

  public animate(delta: number) {
    this.g.clear()
    this.drawFourier()
    this.drawDebugCircles()

    if (this.drawing.length > 1) {
      this.g.lineStyle(1, 0xAAFF22)
      this.g.moveTo(this.drawing[0].x, this.drawing[0].y)
      for (const point of this.drawing) {
        this.g.lineTo(point.x, point.y)
      }
    }
  }

  private drawFourier() {
    //drawing helper
    this.g.beginFill(0x333333, 0.1)
    this.g.drawRect(-this.x, -this.y, screen.width, screen.height)
    this.g.endFill()

    const step = (2 * Math.PI) / this.fourierY.length
    this.angl += step

    const start = { xx: 600, xy: 0, yx: 100, yy: 300 }

    const vx = this.epicycle(start.xx, start.xy, 0, this.fourierX)
    const vy = this.epicycle(start.yx, start.yy, Math.PI / 2, this.fourierY)

    const drawPoint = {
      x: vx.x,
      y: vy.y
    }

    this.path.push(drawPoint)

    this.path.length > this.fourierX.length ? this.path.pop() : false

    this.g.beginFill(0xFFAA12)
    this.g.drawCircle(vx.x, vx.y, 5)
    this.g.drawCircle(vy.x, vy.y, 5)
    this.g.endFill()

    // const lineShift = 2 * 160

    let started = false

    this.g.lineStyle(1.2, 0xFFFFFF)
    for (const point of this.path) {
      if (!started) {
        started = true
        this.g.moveTo(point.x, point.y)
      }
      this.g.lineTo(point.x, point.y)
    }
    this.g.lineStyle(0)
  }

  private epicycle(x: number, y: number, rotation: number, fourier: IFourierTransform[]) {
    this.g.lineStyle(1, 0xFFFFFF, 0.2)
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
    this.g.lineStyle(0)
    return point
  }
}