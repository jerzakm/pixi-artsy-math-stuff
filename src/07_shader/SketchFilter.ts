import { Filter } from 'pixi.js'
import { defaultVertexShader } from './shaderDefaults';

export class SketchFilter extends Filter {
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

  const int anglenums = 4;


  #define PI2 6.28318530717959

  #define RANGE 16.
  #define STEP 2.
  #define ANGLENUM 4.
  #define MAGIC_GRAD_THRESH 0.01

  #define MAGIC_SENSITIVITY     10.
  #define MAGIC_COLOR           0.5

  vec4 getCol(vec2 pos)
  {
    return texture2D(uSampler, pos);
  }

  float getVal(vec2 pos)
  {
      vec4 c=getCol(pos);
      return dot(c.xyz, vec3(0.2126, 0.7152, 0.0722));
  }

  vec2 getGrad(vec2 pos, float eps)
  {
      vec2 d=vec2(eps,0);
      return vec2(
          getVal(pos+d.xy)-getVal(pos-d.xy),
          getVal(pos+d.yx)-getVal(pos-d.yx)
      )/eps/2.;
  }

  void pR(inout vec2 p, float a) {
    p = cos(a)*p + sin(a)*vec2(p.y, -p.x);
  }
  float absCircular(float t)
  {
      float a = floor(t + 0.5);
      return mod(abs(a - t), 1.0);
  }

  void main(void)
  {
    vec2 pos = vTextureCoord;
    float weight = 1.0;

    for (int j = 0; j < anglenums; j ++)
    {
        vec2 dir = vec2(1, 0);
        pR(dir, j * PI2 / (2. * ANGLENUM));

        vec2 grad = vec2(-dir.y, dir.x);

        for (float i = -RANGE; i <= RANGE; i += STEP)
        {
            vec2 pos2 = pos + normalize(dir)*i;

            vec2 g = getGrad(pos2, 1.);
            if (length(g) < MAGIC_GRAD_THRESH)
                continue;

            weight -= pow(abs(dot(normalize(grad), normalize(g))), MAGIC_SENSITIVITY) / floor((2. * RANGE + 1.) / STEP) / ANGLENUM;
        }
    }

    vec4 col = vec4(getVal(pos));

    vec4 background = mix(col, vec4(1), MAGIC_COLOR);

    // because apparently all shaders need one of these. It's like a law or something.
    float r = length(pos - filterArea.xy*.5) / filterArea.x;
    float vign = 1. - r*r*r;


    gl_FragColor = vign * mix(vec4(0), background, weight);
  }
  `
}