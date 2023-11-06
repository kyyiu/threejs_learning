import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100000
)

camera.position.set(1000, 1000, 1000)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
const self = {}
export default function () {
  const container = useRef()

  useEffect(() => {
    window.addEventListener('resize', onWindowResize, false);//窗口变化监听
    init()
    container.current.appendChild(renderer.domElement)
    refresh()
  }, [])

  function init() {
    self.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    self.loader.setDRACOLoader(dracoLoader)
    self.loader.load('/model/city.glb', gltf => {
      sence.add(gltf.scene)
    })
    const hdrLoader = new RGBELoader()
    hdrLoader.loadAsync(require('../vr_house/hdr/h.hdr')).then(texture => {
      sence.background = texture
      sence.environment = texture
      sence.environment.mapping = Three.EquirectangularReflectionMapping
    })
    renderer.shadowMap.enabled = true
    renderer.toneMapping = Three.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;//获得当前摄像机缩放比
    camera.updateProjectionMatrix();//更新矩阵
    renderer.setSize(width, height);
  }

  function refresh(time) {
    renderer.render(sence, camera)
    window.requestAnimationFrame(refresh)
  }

  return <div ref={container}></div>
}