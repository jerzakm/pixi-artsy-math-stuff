import { Container, Graphics, interaction } from "pixi.js";
import { Point, findPointWithAngle } from "../math/coordMath";
import * as voronoi from 'voronoi'

export class Voronoi extends Container {
  g: Graphics
  points: Point[] = []
  cells = 10
  sizeX = 1000
  sizeY = 1000
  v = new voronoi.default()

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.genPoints()
    this.interaction()
    const bbox = { xl: 0, xr: this.sizeX, yt: 0, yb: this.sizeY }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    const sites = this.points
    const vc = this.v.compute(sites, bbox)
    console.log(vc.cells)
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

    const bbox = { xl: 0, xr: this.sizeX, yt: 0, yb: this.sizeY }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    const sites = this.points
    const vc = this.v.compute(sites, bbox)

    this.g.lineStyle(3, 0xEEAA11)
    // for (const edge of vc.edges) {
    //   this.g.moveTo(edge.va.x, edge.va.y)
    //   this.g.lineTo(edge.vb.x, edge.vb.y)
    // }

    const poly = []
    for (const cell of vc.cells) {
      for (const halfedge of cell.halfedges) {
        this.g.moveTo(halfedge.edge.va.x, halfedge.edge.va.y)
        this.g.lineTo(halfedge.edge.vb.x, halfedge.edge.vb.y)
        // const start = halfedge.getStartpoint()
        // const end = halfedge.getEndpoint()
        // poly.push(start.x, start.y, end.x, end.y)
      }
    }

    // this.g.drawPolygon(poly)

    this.g.lineStyle(0)
  }


}