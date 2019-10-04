import { Container, Graphics, interaction } from "pixi.js";
import { Point, findPointWithAngle, distanceBetweenPoints, calcAngleBetweenPoints } from "../math/coordMath";
import { calcHexPoints } from "../math/hexMath";


export class HexTree extends Container {
  g: Graphics
  root: HexTreeNode
  hexSize = 30
  hexPoly = calcHexPoints(this.hexSize, this.hexSize * Math.sqrt(3), true)
  baseDistance = 240

  constructor() {
    super()
    this.g = new Graphics()
    this.addChild(this.g)
    this.interaction()
    this.root = {
      parent: null,
      children: [],
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      rotation: 0,
      points: []
    }

    this.root.points = this.arrayToVector(this.hexPoly)

    this.generate(this.root, 0, 3)

    console.log(this)
  }

  private interaction() {
    this.g.interactive = true
    this.g.on('mousemove', (e: interaction.InteractionEvent) => {

    })
  }

  private generate(hex: HexTreeNode, currentGen = 0, maxGen = 1) {
    currentGen += 1
    for (const p of hex.points) {
      const angle = calcAngleBetweenPoints({ x: 0, y: 0 }, p)
      const position = findPointWithAngle(hex.position, angle, this.baseDistance * currentGen)

      const newNode = this.makeNewNode(hex, position, angle + 30)

      const nDist = distanceBetweenPoints(position, this.root.position)
      const oDist = distanceBetweenPoints(hex.position, this.root.position)

      if (nDist > oDist) {
        this.root.children.push(newNode)
      }
      if (currentGen < maxGen) {
        this.generate(newNode)
      }
    }
  }

  private drawHex(hex: HexTreeNode) {
    const points = []
    for (let i = 0; i < hex.points.length; i++) {
      points.push(hex.points[i].x + hex.position.x, hex.points[i].y + hex.position.y)

    }
    this.g.drawPolygon(points)
    hex.children.map(child => this.drawHex(child))
  }

  public animate(delta: number) {
    this.g.clear()

    this.g.beginFill(0xaaaaaa)
    this.g.drawRect(0, 0, window.innerWidth, window.innerHeight)
    this.g.endFill()

    this.g.lineStyle(3, 0x121212)
    this.drawHex(this.root)


  }

  arrayToVector = (array: number[]) => {
    const points: Point[] = []
    for (let i = 0; i < array.length; i += 2) {
      points.push({ x: array[i], y: array[i + 1] })
    }
    return points
  }

  rotateHex = (angle: number) => {
    const points = this.arrayToVector(this.hexPoly)
    const newpoints = []

    for (const p of points) {
      const dist = distanceBetweenPoints({ x: 0, y: 0 }, p)
      const currentAngle = calcAngleBetweenPoints({ x: 0, y: 0 }, p)

      const np = findPointWithAngle({ x: 0, y: 0 }, currentAngle + angle, dist)

      newpoints.push(np)
    }

    return newpoints
  }

  makeNewNode = (parent: HexTreeNode, position: Point, angle: number): HexTreeNode => {
    const points = this.rotateHex(angle)
    points.map(p => {
      p.x + position.x
      p.y + position.y
    })

    return {
      parent: parent,
      children: [],
      position: position,
      rotation: angle,
      points: points
    }
  }
}

interface HexTreeNode {
  parent: null | HexTreeNode
  children: HexTreeNode[]
  position: Point
  rotation: number
  points: Point[]
}
