// Maps into DawnBringer's 4-bit (16 color) palette http://www.pixeljoint.com/forum/forum_posts.asp?TID=12795
// Also see the amazing ASCII shadertoy: https://www.shadertoy.com/view/lssGDj

float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }


float compare(vec3 a, vec3 b) {
	a*=a*a;
	b*=b*b;
	vec3 diff = (a - b);
	return dot(diff, diff);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	const float pixelSize = 0.5;
	vec2 c = floor(fragCoord.xy / pixelSize);
	vec2 coord = c * pixelSize;
	vec3 src = texture(iChannel0, coord / iResolution.xy).rgb;
	
	// Track the two best colors
	vec3 dst0 = vec3(0), dst1 = vec3(0);
	float best0 = 1e3, best1 = 1e3;
#	define TRY(R, G, B) { const vec3 tst = vec3(R, G, B); float err = compare(src, tst); if (err < best0) { best1 = best0; dst1 = dst0; best0 = err; dst0 = tst; } }    
    TRY(0.823529, 0.666667, 0.600000);
    TRY(0.854902, 0.831373, 0.368627);
    TRY(0.870588, 0.933333, 0.839216);
#	undef TRY	


	fragColor = vec4(mod(c.x + c.y, 2.0) >  (hash(c * 2.0 + fract(sin(vec2(floor(1.0), floor(1.0 * 1.7))))) * 0.75) + (best1 / (best0 + best1)) ? dst1 : dst0, 1.0);
}