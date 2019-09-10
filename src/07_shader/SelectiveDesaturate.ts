import { Filter } from 'pixi.js'
import { defaultVertexShader } from './shaderDefaults';

export class SelectiveDesaturate extends Filter {
  constructor() {
    super(defaultVertexShader, buildFragmentShader());
  }
}

const buildFragmentShader = () => {

  return `
  precision mediump float;

  varying vec2 vTextureCoord;

  uniform sampler2D uSampler;

  uniform vec4 filterArea;

  vec3 desaturate(vec3 color, float f) {

    vec3 grayXfer = vec3(0.2, 0.2, 0.8);
    vec3 gray = vec3(dot(grayXfer, color));
    return mix(color, gray, f);
  }

  void main(void)
  {
    vec3 ic = texture2D(uSampler, vTextureCoord).rgb;
    vec3 nrm = normalize(vec3(1.0));
    float delta = dot(normalize(ic), nrm);
    delta = pow(delta, 10.0);
    vec3 color = desaturate(ic, delta);

    gl_FragColor = vec4(color, 1.0);
  }
  `
}