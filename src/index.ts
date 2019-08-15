import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import * as Color from 'color'
import { Container, Graphics } from "pixi.js";
import { polarCoords, Point } from './math/coordMath'
import { ILissajousTableOptions, LissajousTable } from "./01_lissajous/LissajousTable";
import { CirclePacking } from "./02_circlePacking/CirclePacking";

renderer.initRenderer()

var stats = new Stats.default();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const helperCanvas = document.createElement('canvas')
document.body.appendChild(helperCanvas)
helperCanvas.width = renderer.renderer.width
helperCanvas.height = renderer.renderer.height
helperCanvas.style.position = 'fixed'
helperCanvas.style.top = '0'
helperCanvas.style.left = '0'

/// LISSAJOUS SETUP

// const options: ILissajousTableOptions = {
//     gridSize: 25,
//     cellSize: 48,
//     pointCircleR: 5,
//     rotationSpeed: 0.0015,
//     helperCanvas: shapeCanvas
// }

// const lissajousTable = new LissajousTable(options)
// lissajousTable.x = 50
// lissajousTable.y = 50
// renderer.stage.addChild(lissajousTable)

// CIRCLE PACKING SETUP

const circlePacking = new CirclePacking()
renderer.stage.addChild(circlePacking)


renderer.ticker.add((delta) => {
    stats.begin()

    // lissajousTable.animate()

    circlePacking.animate(delta)

    stats.end()
})