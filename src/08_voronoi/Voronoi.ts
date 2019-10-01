import { Container, Graphics, interaction } from "pixi.js";
import { Point, findPointWithAngle } from "../math/coordMath";

export class Voronoi extends Container {
  g: Graphics
  points: Point[] = []
  cells = 50
  sizeX = 1000
  sizeY = 600

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.genPoints()
    this.interaction()
  }

  private genPoints() {
    for (let i = 0; i < this.cells; i++) {
      this.points.push({
        x: Math.random() * this.sizeX,
        y: Math.random() * this.sizeY
      })
    }
  }

  private interaction() {
    this.g.interactive = true
    this.g.on('mousemove', (e: interaction.InteractionEvent) => {
      if (this.points.length > 0) {
        const loc = e.data.getLocalPosition(this.g)
        this.points[0].x = loc.x
        this.points[0].y = loc.y
      }
    })
  }

  public animate(delta: number) {
    this.g.clear()

    this.g.lineStyle(2, 0xFFee11)
    this.g.drawRect(0, 0, this.sizeX, this.sizeY)
    this.g.lineStyle(0)

    this.g.beginFill(0xEEEEEE)
    for (const point of this.points) {
      this.g.drawCircle(point.x, point.y, 2)
    }
    this.g.endFill()
  }


}


interface IRadarSegment {
  angle: number
  length: number
  distance: number
}