import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import * as Color from 'color'
import { Container, Graphics } from "pixi.js";
import { polarCoords, Point } from './math/coordMath'
import { ILissajousTableOptions, LissajousTable } from "./01_lissajous/LissajousTable";
import { PolygonCutting, ICuttablePolygon } from "./02_polygonCutting/PolygonCutting";

renderer.initRenderer()

var stats = new Stats.default();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);


const shapeCanvas = document.createElement('canvas')
document.body.appendChild(shapeCanvas)
shapeCanvas.width = renderer.renderer.width
shapeCanvas.height = renderer.renderer.height
shapeCanvas.style.position = 'fixed'
shapeCanvas.style.top = '0'
shapeCanvas.style.left = '0'

const options:ILissajousTableOptions = {
    gridSize: 25,
    cellSize: 48,
    pointCircleR:5,
    rotationSpeed: 0.0015,
    helperCanvas: shapeCanvas
}

// const lissajousTable = new LissajousTable(options)
// lissajousTable.x = 50
// lissajousTable.y = 50
// renderer.stage.addChild(lissajousTable)

const polygons: ICuttablePolygon[] = []

polygons.push({
    points: [
        200,200,
        200,400,
        600,300
    ],
    color: Color.rgb(200, 30, 0)
})

const polyCutting = new PolygonCutting(polygons)
renderer.stage.addChild(polyCutting)
polyCutting.draggingSetup()

renderer.ticker.add((delta) => {
    stats.begin()

    // lissajousTable.animate()
    polyCutting.animate()
    
    stats.end()
})