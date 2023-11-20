import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import modifyCityMaterial from "./utils/city2/modifyCityMaterial";
import FlyLine from "./utils/city2/flyLine";
import FlyLineShader from "./shader/city2/flyLine";
import LightWall from "./utils/city2/lightWall";
import Radar from "./utils/city2/radar";
import Sign from "./utils/city2/sign";
import styles from './css/city2.module.css'
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
)

camera.position.set(5, 10, 15)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)


let self = {}

class MeshLine {
  constructor(geometry) {
    const edges = new Three.EdgesGeometry(geometry);
    this.material = new Three.LineBasicMaterial({ color: 0xffffff });
    const line = new Three.LineSegments(edges, this.material);
    this.geometry = edges;
    this.mesh = line;
  }
}


export default function () {
  const container = useRef()

  useEffect(() => {
    init()
    window.addEventListener('resize', onWindowResize, false);//窗口变化监听
    container.current.appendChild(renderer.domElement)
    refresh()
    return () => {
      self = {}
    }
  }, [])

  function init() {
    initBackground()
    self.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    self.loader.setDRACOLoader(dracoLoader)
    self.loader.load('/model/city2.glb', gltf => {
      self.gltf = gltf

      gltf.scene.traverse((item) => {
        if (item.type == "Mesh") {
          const cityMaterial = new Three.MeshBasicMaterial({
            color: new Three.Color(0x0c0e33),
          });
          item.material = cityMaterial;
          modifyCityMaterial(item);
          // 生成物体白框
          if (item.name == "Layerbuildings") {
            const meshLine = new MeshLine(item.geometry);
            const size = item.scale.x;
            meshLine.mesh.scale.set(size, size, size);
            sence.add(meshLine.mesh);
          }
        }
      });

      sence.add(gltf.scene)

      // const flyLine = new FlyLine()
      const flyLine = new FlyLine()
      sence.add(flyLine.mesh)
      const flyLineShader = new FlyLineShader()
      sence.add(flyLineShader.mesh)

      const lightWall = new LightWall()
      sence.add(lightWall.mesh)

      const radar = new Radar()
      sence.add(radar.mesh)

      const sign = new Sign(camera)
      sence.add(sign.mesh)
      sign.onClick(function () {
        console.log("TTT点击图标")
        alert('点击图标')
      })
    })
  }
  function initBackground() {
    const textures = new Three.CubeTextureLoader()
    const texturesCube = textures.load([
      require('./pics/1.jpg'),
      require('./pics/2.jpg'),
      require('./pics/3.jpg'),
      require('./pics/4.jpg'),
      require('./pics/5.jpg'),
      require('./pics/6.jpg')
    ])
    sence.background = texturesCube
    sence.environment = texturesCube
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

  return <div>
    <div ref={container}></div>
    <OprationPanel></OprationPanel>
  </div>
}

function OprationPanel() {
  useEffect(() => {
    const d = document.documentElement
    const cw = d.clientWidth || 750;
    d.style.fontSize = 'calc(100vw / 19.2)'
    return () => {
      d.style.fontSize = ''
    }
  })
  return <div className={styles.panel}>
    <div className={styles.header}>我是标题</div>
    <div className={styles.main}>
      <div className={styles.left}>
        {
          [0, 0, 0].map((e, i) => {
            return <div className={styles.cityEvent} key={i}>
              <div className={styles.cityEvent_before}></div>
              <h3 className={styles.h3}>xx事件</h3>
              <h1 className={styles.h1}><span>1000(件)</span></h1>
              <div className={styles.cityEvent_after}></div>
              <div className={styles.footerBorder}>
                <div className={styles.footerBorder_before}></div>
                <div className={styles.footerBorder_after}></div>
              </div>
            </div>
          })
        }
      </div>
    </div>
  </div>
}