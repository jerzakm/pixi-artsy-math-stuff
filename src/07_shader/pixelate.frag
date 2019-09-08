precision mediump float;

varying vec2 vTextureCoord;

uniform vec2 size;
uniform sampler2D uSampler;

uniform vec4 filterArea;

vec2 mapCoord(vec2 coord)
{
  coord*=filterArea.xy;
  coord+=filterArea.zw;
  
  return coord;
}

vec2 unmapCoord(vec2 coord)
{
  coord-=filterArea.zw;
  coord/=filterArea.xy;
  
  return coord;
}

vec2 pixelate(vec2 coord,vec2 size)
{
  return floor(coord/size)*size;
}

void main(void)
{
  vec2 coord=mapCoord(vTextureCoord);
  vec4 color=texture2D(uSampler,vTextureCoord.xy)
  
  coord=pixelate(coord,size);
  
  coord=unmapCoord(coord);
  
  float brightness=sqrt(
    .299*(color.r*color.r)+
    .587*(color.g*color.g)+
    .114*(color.b*color.b));
    float target_c=.25*floor(brightness/.25);
    vec3 tc=vec3(target_c,target_c,target_c);
    
    gl_FragColor=vec4(tc,1.);
  }