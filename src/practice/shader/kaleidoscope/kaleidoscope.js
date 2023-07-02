import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const vertexShader = `  
varying vec2 vUv;
void main() { 
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
// 默认左下角为0，0
// gl_FragCoord.xy/u_resolution
// d = sin(d*8. + u_time)/8.;
//   d = abs(d);
//   d = 0.02/d;
//   col *= 1.0;
const fragmentShader = `
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

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,1.5)
sence.add(camera)

var geometry = new Three.PlaneGeometry( 2, 2 );
const uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new Three.Vector2() }
};

var material = new Three.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
} );

var mesh = new Three.Mesh( geometry, material );
sence.add( mesh );

const renderer = new Three.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
let clock;
export default function() {
    const container = useRef()
  
    useEffect(() => {
      clock = new Three.Clock();
      container.current.appendChild(renderer.domElement)
      refresh()
      return () => {
        clock = null;
      }
    }, [])

    function refresh(time) {
      if (!clock) return;
      uniforms.u_time.value += clock.getDelta();
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }