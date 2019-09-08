import { Filter } from 'pixi.js'

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
precision mediump float;

varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler;

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

    vec4 asd = texture2D(uSampler, coord);

    float brightness = sqrt(
      0.299* (asd.r*asd.r) +
      0.587* (asd.g*asd.g) +
      0.114* (asd.b*asd.b) );

    float target_c = 0.2*floor(brightness/0.2);
    vec3 tc = vec3(target_c*1.2, target_c*0.8, target_c*0.8);

    gl_FragColor = vec4(tc, 1.0);
}
`

export class PixelShader extends Filter {

  constructor(size = 10) {
    super(vertex, fragment);
    this.size = size;
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

// const fragment = `
// precision mediump float;

// varying vec2 vTextureCoord;

// uniform vec2 size;
// uniform sampler2D uSampler;

// uniform vec4 filterArea;

// vec2 mapCoord( vec2 coord )
// {
//     coord *= filterArea.xy;
//     coord += filterArea.zw;

//     return coord;
// }

// vec2 unmapCoord( vec2 coord )
// {
//     coord -= filterArea.zw;
//     coord /= filterArea.xy;

//     return coord;
// }

// vec2 pixelate(vec2 coord, vec2 size)
// {
// 	return floor( coord / size ) * size;
// }

// void main(void)
// {
//     vec2 coord = mapCoord(vTextureCoord);

//     coord = pixelate(coord, size);

//     coord = unmapCoord(coord);

//     gl_FragColor = texture2D(uSampler, coord);
// }
// `