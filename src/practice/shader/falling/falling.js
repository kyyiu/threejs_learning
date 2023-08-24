import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './glsl/vShader'
import fragmentShader from './glsl/fShader'

export default function () {
  const sence = new Three.Scene();
  const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.set(0, 0, 1)
  sence.add(camera)

  var geometry = new Three.PlaneGeometry(3, 3);
  const uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new Three.Vector2() }
  };

  var material = new Three.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // side: Three.DoubleSide
  });

  var mesh = new Three.Mesh(geometry, material);
  sence.add(mesh);

  const renderer = new Three.WebGLRenderer()
  // const controls = new OrbitControls(camera, renderer.domElement)
  // // 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
  // controls.enableDamping = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  let clock;
  const container = useRef()

  useEffect(() => {
    clock = new Three.Clock();
    window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
    container.current.appendChild(renderer.domElement)
    refresh()
    return () => {
      clock = null;
    }
  }, [])

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;//获得当前摄像机缩放比
    camera.updateProjectionMatrix();//更新矩阵
    renderer.setSize( width, height );
  }

  function refresh(time) {
    if (!clock) return;
    uniforms.u_time.value += clock.getDelta();
    renderer.render(sence, camera)
    window.requestAnimationFrame(refresh)
  }

  return <div ref={container}></div>
}