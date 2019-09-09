import { Sprite, Graphics, resources, Texture, Container } from "pixi.js"
import { renderer } from "../core/renderer"
import { loader } from ".."
import { PixelLimitedColorFilter } from "./PixelLimitedColor"
import * as PixiFilters from 'pixi-filters'

const sprites: Sprite[] = [] //0 img, 1 vid

export const initShaderPreview = async (parent: Container) => {

  await makePreviewSprites(parent)
  applyFilters()
  return update
}

const update = (delta: number) => {

}

const makePreviewSprites = (parent: Container) => {
  return new Promise((resolve, reject) => {
    loader
      .add('lk', 'lk.jpg')
      .add('v', 'sv2.mp4')
      .load(async () => {
        const imgSprite = Sprite.from(loader.resources['lk'].texture)
        imgSprite.x = 50
        parent.addChild(imgSprite)

        sprites.push(imgSprite)

        const videoSource = new resources.VideoResource('sv2.mp4', {
          autoPlay: false,
          autoLoad: true,
          // updateFPS: 12
        });

        if (videoSource.source instanceof HTMLVideoElement) {
          const vs = videoSource.source
          await vs.play();
          vs.loop = true

          const texture = Texture.from(vs);
          const vidSprite = Sprite.from(texture)
          vidSprite.scale.x = 0.8
          vidSprite.scale.y = 0.8
          vidSprite.x = imgSprite.width + imgSprite.x + 50

          parent.addChild(vidSprite)
          sprites.push(vidSprite)
          resolve()
        }
      })
  })

}

const applyFilters = () => {
  for (const sprite of sprites) {
    sprite.filters = [
      new PixelLimitedColorFilter(8)
    ]
  }
}