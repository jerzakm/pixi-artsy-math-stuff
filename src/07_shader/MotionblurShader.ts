import { Filter } from 'pixi.js'
import { defaultVertexShader } from './shaderDefaults';

export class LavaShader extends Filter {
  constructor() {
    super(defaultVertexShader, buildFragmentShader());
  }
}

const buildFragmentShader = () => {

  return `

  #define time 1.0
  #define tau 6.2831853

  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform vec4 filterArea;

  mat2 makem2(float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
  float noise(vec2 x ){return texture2D(uSampler, x*.01).x;}

  float fbm(in vec2 p)
  {
    float z=2.;
    float rz = 0.;
    vec2 bp = p;
    for (float i= 1.;i < 6.;i++)
    {
      rz+= abs((noise(p)-0.5)*2.)/z;
      z = z*2.;
      p = p*2.;
    }
    return rz;
  }

  float dualfbm(in vec2 p)
  {
      //get two rotated fbm calls and displace the domain
    vec2 p2 = p*.7;
    vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));
    basis = (basis-.5)*.2;
    p += basis;

    //coloring
    return fbm(p*makem2(time*0.2));
  }

  float circ(vec2 p)
  {
    float r = length(p);
    r = log(sqrt(r));
    return abs(mod(r*4.,tau)-3.14)*3.+.2;

  }

  void main(void)
  {
    //setup system
    vec2 p = vTextureCoord.xy / filterArea.xy;
    p.x *= filterArea.x/filterArea.y;
    p*=8.;

      float rz = dualfbm(p);

    //rings
    p /= exp(mod(time*10.,3.14159));
    rz *= pow(abs((0.1-circ(p))),.9);

    //final color
    vec3 col = vec3(.2,0.1,0.4)/rz;
    col=pow(abs(col),vec3(.99));
    gl_FragColor = vec4(col,1.);
  }

  `
}