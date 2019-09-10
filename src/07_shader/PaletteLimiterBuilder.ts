import { Filter } from 'pixi.js'
import { defaultVertexShader } from './shaderDefaults';

const fragment = `
precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform vec4 filterArea;

float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float compare(vec3 a, vec3 b) {
	a*=a*a;
	b*=b*b;
	vec3 diff = (a - b);
	return dot(diff, diff);
}

void main(void)
{
    const float pixelSize = 0.5;
    vec2 c = floor(vTextureCoord.xy / pixelSize);
    vec2 coord = c * pixelSize;
    vec3 src = texture2D(uSampler, vTextureCoord).rgb;

    vec3 dst0 = vec3(0), dst1 = vec3(0);
    float best0 = 1e3, best1 = 1e3;
    
    #	define TRY(R, G, B) { const vec3 tst = vec3(R, G, B); float err = compare(src, tst); if (err < best0) { best1 = best0; dst1 = dst0; best0 = err; dst0 = tst; } }    
    TRY(0.1, 0.1, 0.1);
    TRY(0.854902, 0.831373, 0.368627);
    TRY(0.870588, 0.933333, 0.839216);
    #	undef TRY	

    gl_FragColor = vec4(mod(c.x + c.y, 2.0) >  (hash(c * 2.0 + fract(sin(vec2(floor(1.0), floor(1.0 * 1.7))))) * 0.75) + (best1 / (best0 + best1)) ? dst1 : dst0, 1.0);
}
`

export class PaletteLimiterBuilder extends Filter {

  constructor() {
    super(defaultVertexShader, fragment);

  }
}
