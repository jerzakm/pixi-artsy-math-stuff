import { Sprite, Graphics, resources, Texture, Container, utils, Program } from "pixi.js"
import { renderer } from "../core/renderer"
import { loader } from ".."
import { PixelLimitedColorFilter } from "./PixelLimitedColor"
import * as PixiFilters from 'pixi-filters'
import { PaletteLimiter } from "./PaletteLimiter"



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
      //   // updateFPS: 12
      // });

      // if (videoSource.source instanceof HTMLVideoElement) {
      //   const vs = videoSource.source
      //   await vs.play();
      //   vs.loop = true

      //   const texture = Texture.from(vs);
      //   const vidSprite = Sprite.from(texture)
      //   vidSprite.scale.x = 0.7
      //   vidSprite.scale.y = 0.7
      //   vidSprite.x = imgSprite.width + imgSprite.x + 50

      //   parent.addChild(vidSprite)
      //   sprites.push(vidSprite)
      // }

      applyFilters()
    })

}

const applyFilters = () => {

  const palette = [0xFFFFFF, 0x000000, 0x00DD00]
  const floatPalette: Float32Array[] = []

  for (const color of palette) {
    let f = new Float32Array(3)
    utils.hex2rgb(color, f)
    floatPalette.push(f)
  }

  const limiter = new PaletteLimiter(floatPalette)
  const bevel = new PixiFilters.BevelFilter()
  const pixelLimiter = new PixelLimitedColorFilter(8)

  for (const sprite of sprites) {
    sprite.filters = [
      // pixelLimiter,
      limiter
    ]
  }

  console.log(bevel)
  console.log(limiter)
  console.log(pixelLimiter.program)

}