import { Filter, utils } from 'pixi.js'

const vertex = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`

const fragment = `
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec4 filterArea;

const int paletteLength = 3;

uniform vec3 palette[3];

float colorDistance(vec3 color1, vec3 color2)
{
    return sqrt(
        pow(color2.r - color1.r, 2.0) +
        pow(color2.g - color1.g, 2.0) +
        pow(color2.b - color1.b, 2.0));
}

vec3 conformColor(vec3 color)
{
    vec3 closestColor = palette[0];
    float currentDistance = 255.0;

    for(int i = 0; i < paletteLength; i++)
    {
      float dist = colorDistance(palette[i], color);
      if(dist < currentDistance)
      {
          currentDistance = dist;
          closestColor = palette[i];
      }
    }

    return closestColor;
}

void main(void)
{
    vec4 p = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(conformColor(p.xyz), 1.0);
}
`

export class PaletteLimiter extends Filter {


  constructor(palette: Float32Array[]) {
    super(vertex, fragment);

    this.uniforms.palette = palette


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