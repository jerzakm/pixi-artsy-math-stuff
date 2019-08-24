import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import { Container, Graphics, GraphicsGeometry, RENDERER_TYPE } from "pixi.js"
import { polarCoords, Point } from './math/coordMath'
import { ILissajousTableOptions, LissajousTable } from "./01_lissajous/LissajousTable"
import { CirclePacking } from "./02_circlePacking/CirclePacking"
import { GiftWrapping } from "./03_giftWrapping/GiftWrapping"
import { Windmill } from "./04_windMill/Windmill";
import { RadarFragment } from "./05_radarFragment/RadarFragment";
import { FourierSeries } from "./06_fourierDrawing/FourierSeries";
import { FourierDrawing } from "./06_fourierDrawing/FourierDrawing";

renderer.initRenderer()

var stats = new Stats.default()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const helperCanvas = document.createElement('canvas')
document.body.appendChild(helperCanvas)
helperCanvas.width = renderer.renderer.width
helperCanvas.height = renderer.renderer.height
helperCanvas.style.position = 'fixed'
helperCanvas.style.top = '0'
helperCanvas.style.left = '0'


// LISSAJOUS SETUP
// const options: ILissajousTableOptions = {
//     gridSize: 25,
//     cellSize: 48,
//     pointCircleR: 5,
//     rotationSpeed: 0.0015,
//     helperCanvas: helperCanvas
// }

// const lissajousTable = new LissajousTable(options)
// lissajousTable.x = 50
// lissajousTable.y = 50
// renderer.stage.addChild(lissajousTable)

// CIRCLE PACKING SETUP
// const circlePacking = new CirclePacking()
// circlePacking.x = 0
// circlePacking.y = 0
// renderer.stage.addChild(circlePacking)


// GIFT WRAPPING SETUP
// const giftWrapping = new GiftWrapping(300, 300, 15)
// giftWrapping.x = 100
// giftWrapping.y = 100
// renderer.stage.addChild(giftWrapping)

// const windmill = new Windmill(7)
// renderer.stage.addChild(windmill)
// windmill.x = 100
// windmill.y = 50

// const radar = new RadarFragment(window.innerHeight/2-50, 5)
// radar.x = 100
// radar.y = 50
// renderer.stage.addChild(radar)

// const fourierSeries = new FourierSeries()
// fourierSeries.x = 300
// fourierSeries.y = 300
// renderer.stage.addChild(fourierSeries)

const fourierDrawing = new FourierDrawing()
fourierDrawing.x = 50
fourierDrawing.y = 100
renderer.stage.addChild(fourierDrawing)

renderer.ticker.add((delta) => {
    stats.begin()

    // lissajousTable.animate()
    // circlePacking.animate(delta)
    // giftWrapping.animate(delta)
    // windmill.animate(delta)
    // radar.animate(delta)
    // fourierSeries.animate(delta)
    fourierDrawing.animate(delta)

    stats.end()
})