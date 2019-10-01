import { Sprite, Graphics, resources, Texture, Container, utils, Program, filters, Geometry, WRAP_MODES, MIPMAP_MODES, Mesh, Shader } from "pixi.js"
import { renderer, ticker } from "../core/renderer"
import { loader } from ".."
import { PixelLimitedColorFilter } from "./PixelLimitedColor"
import * as PixiFilters from 'pixi-filters'
import { PaletteLimiterBuilder, RgbColor } from "./PaletteLimiterBuilder";
import Color from 'color'
import { SelectiveDesaturate } from "./SelectiveDesaturate"
import { WaveyStripes } from "./WaveyStripes"
import { SketchFilter } from "./SketchFilter"
import { HeightMapShader } from "./HeightMapShader"
import { LavaShader } from "./MotionblurShader"



const sprites: Sprite[] = [] //0 img, 1 vid

export const initShaderPreview = (parent: Container) => {

  makePreviewSprites(parent)
  // makeGeoShader(parent)
  return update
}

const update = (delta: number) => {

}

let imgSprite

const makePreviewSprites = (parent: Container) => {
  loader
    .add('lk', 'noise.jpg')
    .add('v', 'sv8.mp4')
    .load(async () => {
      imgSprite = Sprite.from(loader.resources['lk'].texture)
      imgSprite.x = 50
      imgSprite.scale.x = 1
      imgSprite.scale.y = 1
      // parent.addChild(imgSprite)

      const filteredSprite = Sprite.from(loader.resources['lk'].texture)
      filteredSprite.x = 50
      filteredSprite.scale.x = 1
      filteredSprite.scale.y = 1
      parent.addChild(filteredSprite)



      sprites.push(filteredSprite)

      const videoSource = new resources.VideoResource('sv6.mp4', {
        autoPlay: true,
        autoLoad: true
      });

      if (videoSource.source instanceof HTMLVideoElement) {
        const vs = videoSource.source
        vs.currentTime = 0
        vs.volume = 0
        // await vs.play();
        vs.loop = true
        vs.playbackRate = 0.8



        const texture = Texture.from(videoSource.source);



        const vidSprite = Sprite.from(texture)
        vidSprite.scale.x = 0.8
        vidSprite.scale.y = 0.8
        vidSprite.x = filteredSprite.x + filteredSprite.width

        // parent.addChild(vidSprite)
        // sprites.push(vidSprite)
      }

      applyFilters()
    })

}

const applyFilters = () => {

  for (const sprite of sprites) {
    sprite.filters = [
      // new PixiFilters.AdjustmentFilter({ brightness: 1.1, gamma: 1.3, contrast: 2.5, saturation: 1.0, red: 1.0, green: 1.0 }),
      // new SelectiveDesaturate(),
      // new PaletteLimiterBuilder(palette),
      // new PixiFilters.PixelateFilter(6),
      // new WaveyStripes(),
      // new filters.AlphaFilter(0.3),
      // new SketchFilter(),
      // new HeightMapShader(),
      new LavaShader(),
    ]
  }

}

const hexStringToRgb = (hex: string) => {
  const c = new Color(hex)
  return { r: c.red(), g: c.green(), b: c.blue() }
}

const makeGeoShader = (parent: Container) => {
  //Build geometry.
  const geometry = new Geometry()
    .addAttribute('aVertexPosition', // the attribute name
      [-100, -100, // x, y
        100, -100, // x, y
        100, 100,
      -100, 100], // x, y
      2) // the size of the attribute
    .addAttribute('aUvs', // the attribute name
      [0, 0, // u, v
        1, 0, // u, v
        1, 1,
        0, 1], // u, v
      2) // the size of the attribute
    .addIndex([0, 1, 2, 0, 2, 3]);

  const vertexSrc = `
    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec2 aUvs;
    uniform mat3 translationMatrix;
    uniform mat3 projectionMatrix;
    varying vec2 vUvs;
    void main() {
        vUvs = aUvs;
        gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    }`;


  const fragmentSrc = `
	//Based on this: https://www.shadertoy.com/view/wtlSWX
	precision mediump float;
	varying vec2 vUvs;

	uniform sampler2D noise;
	uniform float time;

	//Distance function. Just calculates the height (z) from x,y plane with really simple length check. Its not exact as there could be shorter distances.
	vec2 dist(vec3 p)
	{
	  float id = floor(p.x)+floor(p.y);
	  id = mod(id, 2.);
	  float h = texture2D(noise, vec2(p.x, p.y)*0.04).r*5.1;
	  return vec2(h-p.z,id);
	}

	//Light calculation.
	vec3 calclight(vec3 p, vec3 rd)
	{
	  vec2 eps = vec2( 0., 0.001);
	  vec3 n = normalize( vec3(
		dist(p+eps.yxx).x - dist(p-eps.yxx).x,
		dist(p+eps.xyx).x - dist(p-eps.xyx).x,
		dist(p+eps.xxy).x - dist(p-eps.xxy).x
	  ));

	  vec3 d = vec3( max( 0., dot( -rd ,n)));

	  return d;
	}
	void main()
	{
	  vec2 uv = vec2(vUvs.x,1.-vUvs.y);
	  uv *=2.;
	  uv-=1.;

	  vec3 cam = vec3(0.,time -2., -3.);
	  vec3 target = vec3(sin(time)*0.1, time+cos(time)+2., 0. );
	  float fov = 2.2;
	  vec3 forward = normalize( target - cam);
	  vec3 up = normalize(cross( forward, vec3(0., 1.,0.)));
	  vec3 right = normalize( cross( up, forward));
	  vec3 raydir = normalize(vec3( uv.x *up + uv.y * right + fov*forward));

	  //Do the raymarch
	  vec3 col = vec3(0.);
	  float t = 0.;
	  for( int i = 0; i < 100; i++)
	  {
		vec3 p = t * raydir + cam;
		vec2 d = dist(p);
		t+=d.x*0.5;//Jump only half of the distance as height function used is not really the best for heightmaps.
		if(d.x < 0.001)
		{
		  vec3 bc = d.y < 0.5 ? vec3(1.0, .8, 0.) :
					vec3(0.8,0.0, 1.0);
		  col = vec3( 1.) * calclight(p, raydir) * (1. - t/150.) *bc;
		  break;
		}
		if(t > 1000.)
		{
		  break;
		}
	  }
	  gl_FragColor = vec4(col, 1.);
	}`;

  const uniforms = {
    noise: Texture.from('noise.jpg'),
    time: 0,
  };
  //Make sure repeat wrap is used and no mipmapping.
  uniforms.noise.baseTexture.wrapMode = WRAP_MODES.REPEAT;
  uniforms.noise.baseTexture.mipmap = MIPMAP_MODES.OFF;

  //Build the shader and the quad.
  const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);
  const quad = new Mesh(geometry, shader);

  quad.position.set(400, 300);
  quad.scale.set(2);

  parent.addChild(quad);

  // start the animation..
  let time = 0;
  ticker.add((delta) => {
    time += 1 / 60;
    // quad.shader.uniforms.time = time;
    // quad.scale.set(Math.cos(time) * 1 + 2, Math.sin(time * 0.7) * 1 + 2);
  });
}