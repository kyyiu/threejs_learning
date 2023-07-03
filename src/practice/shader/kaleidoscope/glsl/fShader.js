// 默认左下角为0，0
// gl_FragCoord.xy/u_resolution
// d = sin(d*8. + u_time)/8.;
//   d = abs(d);
//   d = 0.02/d;
//   col *= 1.0;
export default /*glsl*/`
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;

vec3 palette(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b*cos(6.28318*(c*t*d));
}
void main() {
  vec2 st = vUv.xy*2.0-1.0;
  // 记录st重置前的位置
  vec2 st2 = st;
  vec3 finalCol = vec3(0.0);
  for(float i = 0.0; i< 4.0; i++) {
    // 每个块重置到中心
    // st = fract(st * 2.0) - 0.5;
    st = fract(st * 1.5) - 0.5;
    // float d = length(st);
    float d = length(st) * exp(-length(st2));
    // 每个块单独变
    // vec3 col = palette(d + u_time);
    // 以整个画布变
    vec3 col = palette(length(st2) + i*.4 + u_time*.4);
    d = sin(d*8. + u_time)/8.;
    d = abs(d);
    // d = 0.01/d;
    d = pow(0.01/d, 1.2);
    // col *= d;
    finalCol += col*d;
  }
  gl_FragColor = vec4(finalCol,1.0);
}`
