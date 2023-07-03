import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './glsl/vShader'
import fragmentShader from './glsl/fShader'

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
const loader = new Three.TextureLoader();
const texture1  = loader.load(require("../../../assets/img/react_logo.png"));
const uniforms = {
    u_time: { type: "f", value: 1.0 },
    iChannel0: {
      value: texture1
    },
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