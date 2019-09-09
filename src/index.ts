import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import { Loader } from "pixi.js"
import { ILissajousTableOptions, LissajousTable } from "./01_lissajous/LissajousTable"
import { CirclePacking } from "./02_circlePacking/CirclePacking"
import { GiftWrapping } from "./03_giftWrapping/GiftWrapping"
import { Windmill } from "./04_windMill/Windmill";
import { RadarFragment } from "./05_radarFragment/RadarFragment";
import { FourierSeries } from "./06_fourierDrawing/FourierSeries";
import { FourierDrawing } from "./06_fourierDrawing/FourierDrawing";
import { initShaderPreview } from "./07_shader/shader_preview"

export const loader = Loader.shared

renderer.initRenderer()

var stats = new Stats.default()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const shaderPreview = initShaderPreview(renderer.stage)


renderer.ticker.add((delta) => {
    stats.begin()


    stats.end()
})