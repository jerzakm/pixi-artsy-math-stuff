import { Container, Graphics, interaction } from "pixi.js";
import { findPointWithAngle, distanceBetweenPoints } from "../math/coordMath";
import * as voronoi from 'voronoi'
import { Vector } from "matter-js";

export class Voronoi extends Container {
  g: Graphics
  points: Vector[] = []
  cellCount = 250
  sizeX = window.innerWidth
  sizeY = window.innerHeight
  v = new voronoi.default()
  bbox = { xl: 0, xr: this.sizeX, yt: 0, yb: this.sizeY }
  relax = 0
  diagram: any

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.genPoints()
    this.interaction()
    const bbox = { xl: 0, xr: this.sizeX, yt: 0, yb: this.sizeY }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    const sites = this.points
    this.diagram = this.v.compute(sites, bbox)
  }

  private genPoints() {
    for (let i = 0; i < this.cellCount; i++) {
      let found = false
      let iterations = 0
      while (!found) {
        iterations++
        let generated = {
          x: Math.random() * this.sizeX,
          y: Math.random() * this.sizeY
        }
        let smallest

        for (let j = 0; j < this.points.length; j++) {
          const dist = distanceBetweenPoints(generated, this.points[j])
          !smallest || dist < smallest ? smallest = dist : null
        }

        if ((smallest && smallest > 60) || this.points.length < 1 || iterations > 1000) {
          found = true
          this.points.push(generated)
        }
      }
    }
  }

  private relaxPoints() {
    const cells = this.diagram.cells
    let iCell = cells.length
    let cell
    let site
    const sites = []
    let rn
    let dist
    let again = false

    var p = 1;

    while (iCell--) {
      cell = cells[iCell];
      rn = Math.random();
      if (rn < p) {
        continue;
      }
      site = cellCentroid(cell);
      dist = distanceBetweenPoints(site, cell.site);
      again = again || dist > 1

      if (dist > 2) {
        site.x = (site.x + cell.site.x) / 2;
        site.y = (site.y + cell.site.y) / 2;
      }
      // probability of mytosis
      if (rn > (1 - p)) {
        dist /= 2;
        sites.push({
          x: site.x + (site.x - cell.site.x) / dist,
          y: site.y + (site.y - cell.site.y) / dist,
        });
      }
      sites.push(site);
    }
    this.diagram = this.v.compute(sites, this.bbox);

    function cellCentroid(cell: any) {
      var x = 0, y = 0,
        halfedges = cell.halfedges,
        iHalfedge = halfedges.length,
        halfedge,
        v, p1, p2;
      while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p1 = halfedge.getStartpoint();
        p2 = halfedge.getEndpoint();
        v = p1.x * p2.y - p2.x * p1.y;
        x += (p1.x + p2.x) * v;
        y += (p1.y + p2.y) * v;
      }
      v = cellArea(cell) * 6;
      return { x: x / v, y: y / v };
    }
    function cellArea(cell: any) {
      var area = 0,
        halfedges = cell.halfedges,
        iHalfedge = halfedges.length,
        halfedge,
        p1, p2;
      while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p1 = halfedge.getStartpoint();
        p2 = halfedge.getEndpoint();
        area += p1.x * p2.y;
        area -= p1.y * p2.x;
      }
      area /= 2;
      return area;
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

    this.relax += delta
    this.relaxPoints()
    if (this.relax > 10) {
      this.relaxPoints()
      this.relax = 0
    }

    this.diagram = this.v.compute(this.points, this.bbox)

    const c = this.diagram.cells[0]
    const cell = c
    if (cell) {
      const halfedges = cell.halfedges
      const nHalfedges = halfedges.length
      if (nHalfedges > 2) {
        let v = halfedges[0].getStartpoint();
        this.g.beginFill(0x772299)
        this.g.moveTo(v.x, v.y);
        for (var iHalfedge = 0; iHalfedge < nHalfedges; iHalfedge++) {
          v = halfedges[iHalfedge].getEndpoint();
          this.g.lineTo(v.x, v.y);
        }
        this.g.endFill()
      }
    }

    this.g.lineStyle(3, 0xEEAA11)
    for (const cell of this.diagram.cells) {
      for (const halfedge of cell.halfedges) {
        this.g.moveTo(halfedge.edge.va.x, halfedge.edge.va.y)
        this.g.lineTo(halfedge.edge.vb.x, halfedge.edge.vb.y)
      }
    }

    this.g.beginFill(0xEEEEEE)
    for (const point of this.points) {
      this.g.drawCircle(point.x, point.y, 2)
    }
    this.g.endFill()
  }


}