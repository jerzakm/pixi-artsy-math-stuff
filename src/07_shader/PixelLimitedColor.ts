import { Filter } from 'pixi.js'
import { defaultVertexShader } from './shaderDefaults';

const fragment = `
precision mediump float;

varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler;

uniform float scaleR;
uniform float scaleG;
uniform float scaleB;

uniform float scaleBrightnessR;
uniform float scaleBrightnessG;
uniform float scaleBrightnessB;

uniform float tresholdA;
uniform float tresholdB;

uniform vec4 filterArea;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

vec2 pixelate(vec2 coord, vec2 size)
{
	return floor( coord / size ) * size;
}

void main(void)
{
    vec2 coord = mapCoord(vTextureCoord);

    coord = pixelate(coord, size);

    coord = unmapCoord(coord);

    vec4 p = texture2D(uSampler, coord);

    float brightness = sqrt(
      scaleBrightnessR* (p.r*p.r) +
      scaleBrightnessG* (p.g*p.g) +
      scaleBrightnessB* (p.b*p.b) );

    float target_c = tresholdA*floor(brightness/tresholdB);
    vec3 tc = vec3(target_c*scaleR, target_c*scaleG, target_c*scaleB);

    gl_FragColor = vec4(tc, 1.0);
}
`

export class PixelLimitedColorFilter extends Filter {

  constructor(size = 10, options: PixelLimitedColorWeights = {}) {
    super(defaultVertexShader, fragment);
    this.size = size;
    this.uniforms.scaleR = options.scaleR ? options.scaleR : 1.0
    this.uniforms.scaleG = options.scaleG ? options.scaleG : 1.0
    this.uniforms.scaleB = options.scaleB ? options.scaleB : 1.0

    this.uniforms.scaleBrightnessR = options.scaleR ? options.scaleR : 0.299
    this.uniforms.scaleBrightnessG = options.scaleG ? options.scaleG : 0.587
    this.uniforms.scaleBrightnessB = options.scaleB ? options.scaleB : 0.114

    this.uniforms.tresholdA = options.tresholdA ? options.tresholdA : 0.2
    this.uniforms.tresholdB = options.tresholdB ? options.tresholdB : 0.2
  }

  get size() {
    return this.uniforms.size;
  }
  set size(value) {
    if (typeof value === 'number') {
      value = [value, value];
    }
    this.uniforms.size = value;
  }
}

interface PixelLimitedColorWeights {
  scaleR?: number
  scaleG?: number
  scaleB?: number
  scaleBrightnessR?: number
  scaleBrightnessG?: number
  scaleBrightnessB?: number
  tresholdA?: number
  tresholdB?: number
}