import { Container, Graphics, interaction, Text } from "pixi.js";
import { Point, findPointWithAngle, distanceBetweenPoints, calcAngleBetweenPoints } from "../math/coordMath";
import { calcHexPoints } from "../math/hexMath";
import { Vector, Engine, World, Bodies, Body, Constraint } from 'matter-js'
import { calcPolygonPoints } from "../math/polyMath";


export class PolyPhysicsTree extends Container {
  g: Graphics
  hexSize = 30
  hexPoly = calcHexPoints(this.hexSize, this.hexSize * Math.sqrt(3), true)
  engine: Engine
  world: World
  root: PolyNode
  generations = 1
  polygons: PolyNode[] = []

  constructor() {
    super()

    this.engine = Engine.create()
    this.world = this.engine.world
    this.world.gravity.x = 0
    this.world.gravity.y = 0

    this.g = new Graphics()
    this.addChild(this.g)
    this.interaction()

    this.root = {
      points: calcPolygonPoints(6, 60, 0, { x: window.innerWidth / 2, y: window.innerHeight / 2 }),
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      size: 70,
      children: [],
      parent: null
    }
    this.polygons.push(this.root)

    this.generate(this.root, 5, 0)
  }

  private generate(parent: PolyNode, faces: number, gen: number) {
    gen++
    for (let i = 0; i < parent.points.length; i++) {
      const positionAngle = (360 / parent.points.length) * i
      const position = findPointWithAngle(parent.position, positionAngle, 200)
      const polyAngle = 0
      const size = 40
      const node: PolyNode = {
        points: calcPolygonPoints(faces, size, polyAngle, position),
        position: position,
        size: size,
        children: [],
        parent: parent
      }
      parent.children.push(node)

      const parentAngle = calcAngleBetweenPoints(node.position, parent.position)
      const pointZeroAngle = calcAngleBetweenPoints(node.position, node.points[0])
      const diff = pointZeroAngle - parentAngle
      node.points = calcPolygonPoints(faces, size, diff, position)


      this.polygons.push(node)
      if (gen < this.generations) {
        this.generate(node, 5, gen)
      }

      const text = new Text(`${i} : ${polyAngle.toFixed(1)} : ${(parentAngle - pointZeroAngle).toFixed(0)}`, { fill: '#FFFFFF' })
      this.addChild(text)
      text.position.x = position.x + 30
      text.position.y = position.y - 15
    }
  }

  private drawPolygons() {

    this.g.lineStyle(2, 0xEFEFEF)
    for (const poly of this.polygons) {
      const p: number[] = []
      poly.points.map(v => p.push(v.x, v.y))
      this.g.drawPolygon(p)
    }
    this.g.lineStyle(0)
  }

  private interaction() {
    this.g.interactive = true
    this.g.on('mousemove', (e: interaction.InteractionEvent) => {

    })
  }

  private updatePhysics(delta: number) {
    Engine.update(this.engine, delta)
  }

  public animate(delta: number) {

    this.updatePhysics(delta)
    this.g.clear()
    this.g.beginFill(0x333333)
    this.g.drawRect(0, 0, window.innerWidth, window.innerHeight)
    this.g.endFill()

    this.drawPolygons()
  }
}

interface PolyNode {
  points: Vector[]
  position: Vector
  size: number
  children: PolyNode[]
  parent: PolyNode | null
}