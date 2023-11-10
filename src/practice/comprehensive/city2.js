import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import modifyCityMaterial from "./utils/city2/modifyCityMaterial";
import FlyLine from "./utils/city2/flyLine";
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    10000
)

camera.position.set(5,10,15)
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


export default function() {
    const container = useRef()
  
    useEffect(() => {
      init()
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      container.current.appendChild(renderer.domElement)
      refresh()
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
          console.log("LLL", item)
          if (item.type == "Mesh") {
            const cityMaterial = new Three.MeshBasicMaterial({
              color: new Three.Color(0x0c0e33),
            });
            item.material = cityMaterial;
            modifyCityMaterial(item);
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
      renderer.setSize( width, height );
    }

    function refresh(time) {
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }