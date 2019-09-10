import { Sprite, Graphics, resources, Texture, Container, utils, Program } from "pixi.js"
import { renderer } from "../core/renderer"
import { loader } from ".."
import { PixelLimitedColorFilter } from "./PixelLimitedColor"
import * as PixiFilters from 'pixi-filters'
import { PaletteLimiter } from "./PaletteLimiter"
import { PaletteLimiterBuilder, RgbColor } from "./PaletteLimiterBuilder";



const sprites: Sprite[] = [] //0 img, 1 vid

export const initShaderPreview = (parent: Container) => {

  makePreviewSprites(parent)
  return update
}

const update = (delta: number) => {

}

const makePreviewSprites = (parent: Container) => {
  loader
    .add('lk', 'lk.jpg')
    .add('v', 'sv2.mp4')
    .load(async () => {
      const imgSprite = Sprite.from(loader.resources['lk'].texture)
      imgSprite.x = 50
      parent.addChild(imgSprite)

      sprites.push(imgSprite)

      // const videoSource = new resources.VideoResource('sv2.mp4', {
      //   autoPlay: false,
      //   autoLoad: true,
      //   updateFPS: 12
      // });

      // if (videoSource.source instanceof HTMLVideoElement) {
      //   const vs = videoSource.source
      //   await vs.play();
      //   vs.loop = true

      //   const texture = Texture.from(vs);
      //   const vidSprite = Sprite.from(texture)
      //   vidSprite.scale.x = 1
      //   vidSprite.scale.y = 1
      //   vidSprite.x =  50

      //   parent.addChild(vidSprite)
        // sprites.push(vidSprite)
      // }

      applyFilters()
    })

}

const applyFilters = () => {

  const palette: RgbColor[] = [
    {r: 255, g: 255, b: 255},
    {r: 0, g: 0, b: 0},
    {r: 220, g: 120, b:0}
  ]  

  const bevel = new PixiFilters.BevelFilter()
  const pixelLimiter = new PixelLimitedColorFilter(6)

  const limiterBuilder = new PaletteLimiterBuilder(palette)
  

  for (const sprite of sprites) {
    sprite.filters = [
      // pixelLimiter,
      // limiter,
      limiterBuilder,
      new PixiFilters.PixelateFilter(4)
    ]
  }

}