import "../src/_scss/main.scss"
import * as renderer from './core/renderer'
import * as Stats from 'stats.js'
import { Container, Graphics, GraphicsGeometry, RENDERER_TYPE, Loader, Sprite, interaction } from "pixi.js"
import { polarCoords, Point } from './math/coordMath'
import { ILissajousTableOptions, LissajousTable } from "./01_lissajous/LissajousTable"
import { CirclePacking } from "./02_circlePacking/CirclePacking"
import { GiftWrapping } from "./03_giftWrapping/GiftWrapping"
import { Windmill } from "./04_windMill/Windmill";
import { RadarFragment } from "./05_radarFragment/RadarFragment";
import { FourierSeries } from "./06_fourierDrawing/FourierSeries";
import { FourierDrawing } from "./06_fourierDrawing/FourierDrawing";

export const loader = Loader.shared

renderer.initRenderer()

var stats = new Stats.default()
stats.showPanel(0)
document.body.appendChild(stats.dom)



loader.add('test', 'test.jpg').load(() => {
    const graphics = new Graphics()
    graphics.position.x = 50
    const sprite = Sprite.from(loader.resources['test'].texture)
    sprite.x = 50
    renderer.stage.addChild(sprite)
    renderer.stage.addChild(graphics)
    const pixels = renderer.renderer.extract.pixels(sprite)
    sprite.alpha = 0

    const avgPixelColor = (pixels.reduce((prev, current) => current += prev)) / pixels.length
    const lineCount = 20

    const getColorIndicesForCoord = (x: number, y: number, width: number) => {
        const red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    };

    let divider = avgPixelColor

    renderer.ticker.add((delta) => {
        stats.begin()
        graphics.clear()
        // divider < 0 ? divider = 500 : divider -= 3
        // simpleWaves()
        // weightedWaves()
        bezierWeightedWaves()


        stats.end()
    })


    const bezierWeightedWaves = () => {
        const verticalStep = 30
        const horizontalStep = 20
        for (let y = 0; y < sprite.height; y += verticalStep) {
            graphics.moveTo(0, y)
            for (let x = 0; x < sprite.width; x += horizontalStep) {
                let colorHeight = 0

                const heightPoints: HeightHelper[] = []

                for (let vert = x; vert < x + horizontalStep; vert++) {
                    for (let h = y; h < y + verticalStep; h++) {
                        const indices = getColorIndicesForCoord(x, h, sprite.width)
                        const r = pixels[indices[0]]
                        const g = pixels[indices[1]]
                        const b = pixels[indices[2]]
                        const a = pixels[indices[3]]
                        colorHeight += (r + g + b)
                    }
                    colorHeight = colorHeight / verticalStep / 3 / divider
                    heightPoints.push({
                        x: vert,
                        h: colorHeight
                    })
                    colorHeight == 1 ? graphics.lineStyle(1, 0xFFFFFF, 1) : graphics.lineStyle(1, 0xFFFFFF, 1)
                }
                heightPoints.sort((a, b) => a.h - b.h)
                const smallest = heightPoints[0]
                const largest = heightPoints[heightPoints.length - 1]
                const pts = [smallest, largest]

                pts.sort((a, b) => a.x - b.x)

                graphics.bezierCurveTo(
                    pts[1].x, pts[1].h * horizontalStep + y,
                    pts[0].x, pts[0].h * horizontalStep + y,
                    heightPoints[heightPoints.length - 1].x, heightPoints[heightPoints.length - 1].h * horizontalStep + y,
                )

            }
        }
        graphics.lineStyle(0)
    }

    const weightedWaves = () => {
        const step = 30
        for (let y = 0; y < sprite.height; y += step) {
            graphics.moveTo(0, y)
            for (let x = 0; x < sprite.width; x += 2) {
                let colorHeight = 0
                for (let h = y; h < y + step; h++) {
                    const indices = getColorIndicesForCoord(x, h, sprite.width)
                    const r = pixels[indices[0]]
                    const g = pixels[indices[1]]
                    const b = pixels[indices[2]]
                    const a = pixels[indices[3]]
                    colorHeight += (r + g + b)
                }
                colorHeight = colorHeight / step / 3 / divider
                colorHeight == 1 ? graphics.lineStyle(1, 0xFFFFFF, 1) : graphics.lineStyle(1, 0xFFFFFF, 1)
                graphics.lineTo(x, y + colorHeight * step)
            }
        }
        graphics.lineStyle(0)
    }

    const simpleWaves = () => {
        const step = 30
        for (let y = 0; y < sprite.height; y += step) {
            graphics.moveTo(0, y)
            for (let x = 0; x < sprite.width; x += 5) {
                const indices = getColorIndicesForCoord(x, y, sprite.width)
                const r = pixels[indices[0]]
                const g = pixels[indices[1]]
                const b = pixels[indices[2]]
                const a = pixels[indices[3]]
                const colorHeight = (r + g + b) / 3 / 255
                colorHeight == 1 ? graphics.lineStyle(1, 0xFFFFFF, 1) : graphics.lineStyle(1, 0xFFFFFF, 1)
                graphics.lineTo(x, y + colorHeight * step)
            }
        }
        graphics.lineStyle(0)
    }
})


interface HeightHelper {
    x: number,
    h: number
}