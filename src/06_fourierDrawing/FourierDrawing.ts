import { Container, Graphics, interaction } from "pixi.js";
import { discreteFourierTransform, IFourierTransform } from "../math/fourier";
import { Point } from "../math/coordMath";
import { drawing } from "./test";
import * as Color from 'color'

enum FourierState {
  DRAWING, RENDERING
}

export class FourierDrawing extends Container {
  g: Graphics
  angl: number
  drawing: Point[]
  path: Point[]
  colours: string[]
  fourierX: IFourierTransform[]
  fourierY: IFourierTransform[]
  state: FourierState
  color: Color
  lineWidth: number
  offset: Point

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.angl = 0
    this.drawing = []
    this.path = []
    this.fourierX = []
    this.fourierY = []
    this.state = FourierState.RENDERING
    this.colours = []
    this.lineWidth = 3
    this.offset = { x: 0, y: 0 }


    this.color = Color.rgb(200, 30, 0)

    this.setup()
  }

  private setup() {
    const x: number[] = []
    const y: number[] = []
    const d = drawing
    const step = 3
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

  private calculateFourierTransform() {
    const x: number[] = []
    const y: number[] = []

    let smallestX
    let largestX
    let smallestY
    let largetstY


    for (let i = 0; i < this.drawing.length; i++) {
      x[i] = this.drawing[i].x
      y[i] = this.drawing[i].y

      !smallestX || x[i] < smallestX ? smallestX = x[i] : null
      !smallestY || y[i] < smallestY ? smallestY = x[i] : null
      !largestX || x[i] > largestX ? largestX = x[i] : null
      !largetstY || y[i] > largetstY ? largetstY = x[i] : null
    }

    if (smallestX && smallestY && largestX && largetstY) {

      for (let i = 0; i < this.drawing.length; i++) {
        x[i] -= Math.abs(smallestX - largestX)
        y[i] -= Math.abs(smallestY - largetstY)
      }
    }

    this.path = []
    this.fourierX = discreteFourierTransform(x)
    this.fourierY = discreteFourierTransform(y)
    this.fourierX.sort((a, b) => b.amp - a.amp)
    this.fourierY.sort((a, b) => b.amp - a.amp)
  }

  private drawStart(event: interaction.InteractionEvent) {
    this.state = FourierState.DRAWING
    const pos = event.data.getLocalPosition(this.g)
    this.drawing = []
    this.drawing.push({
      x: pos.x,
      y: pos.y
    })
  }

  private drawMove(event: interaction.InteractionEvent) {
    if (this.state == FourierState.DRAWING) {
      const pos = event.data.getLocalPosition(this.g)
      if (this.drawing.length > 2) {
        this.drawing.push({
          x: (this.drawing[this.drawing.length - 1].x + pos.x) / 2,
          y: (this.drawing[this.drawing.length - 1].y + pos.y) / 2,
        })
      }
      this.drawing.push({
        x: pos.x,
        y: pos.y
      })
    }
  }

  private drawEnd(event: interaction.InteractionEvent) {
    if (this.state == FourierState.DRAWING) {
      const pos = event.data.getLocalPosition(this.g)
      this.drawing.push({
        x: pos.x,
        y: pos.y
      })
    }
    this.calculateFourierTransform()
    this.state = FourierState.RENDERING
    this.angl = 0
  }

  public animate(delta: number) {
    this.g.clear()

    if (this.color) {
      this.color = this.color.rotate(3)
    }

    if (this.state === FourierState.RENDERING) {
      this.drawFourier()
    }

    if (this.state === FourierState.DRAWING && this.drawing.length > 1) {
      this.g.lineStyle(this.lineWidth, 0xAAFF22)
      this.g.moveTo(this.drawing[0].x, this.drawing[0].y)
      for (const point of this.drawing) {
        this.g.lineTo(point.x, point.y)
      }
      this.g.lineStyle(0)
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
    this.colours.push(this.color.hex().replace('#', '0x'))


    if (this.path.length > this.fourierX.length) {
      this.path.pop()
      this.colours.pop()
    }

    this.g.beginFill(0xFFAA12)
    this.g.drawCircle(vx.x, vx.y, 5)
    this.g.drawCircle(vy.x, vy.y, 5)
    this.g.endFill()

    this.g.moveTo(this.path[0].x, this.path[0].y)
    for (let i = 0; i < this.path.length - 1; i++) {
      this.g.lineStyle(this.lineWidth, this.colours[i])
      this.g.lineTo(this.path[i].x, this.path[i].y)
    }

    this.g.lineStyle(0)

    //drawing location highlight, lines from 2 epicycles and a circle
    this.g.lineStyle(1, 0xEE9900, 0.3)
    this.g.drawCircle(vx.x, vy.y, 15)
    this.g.lineStyle(1, 0xFFFFFF, 0.1)
    this.g.moveTo(vx.x, vx.y)
    this.g.lineTo(vx.x, vy.y)
    this.g.moveTo(vy.x, vy.y)
    this.g.lineTo(vx.x, vy.y)
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