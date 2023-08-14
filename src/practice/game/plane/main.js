import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { Player } from "./Player";

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    70,
    window.innerWidth/window.innerHeight,
    0.01,
    100
)

camera.position.set(-4.37,0,-4.75)
camera.lookAt(0, 0 , 6)
const cameraController = new Three.Object3D()
cameraController.add(camera)
const cameraTarget = new Three.Vector3(0, 0, 6)

sence.add(cameraController)

const ambient = new Three.HemisphereLight(0xffffff, 0xbbbbff, 1)
ambient.position.set(0.5, 1, 0.25)
sence.add(ambient)

const renderer = new Three.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.outputEncoding = Three.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight)

export default function() {
    const clock = new Three.Clock()
    let player
    const container = useRef()
  
    useEffect(() => {
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      container.current.appendChild(renderer.domElement)
      init()
      refresh()
    }, [])

    function init() {
      setEnvironment()
      initSkyBox()
      initPlayer()
    }
    
    function initSkyBox() {
      sence.background = new Three.CubeTextureLoader()
        .load([
          require("../../../assets/gameSource/plane/paintedsky/px.jpg"),
          require("../../../assets/gameSource/plane/paintedsky/nx.jpg"),
          require("../../../assets/gameSource/plane/paintedsky/py.jpg"),
          require("../../../assets/gameSource/plane/paintedsky/ny.jpg"),
          require("../../../assets/gameSource/plane/paintedsky/pz.jpg"),
          require("../../../assets/gameSource/plane/paintedsky/nz.jpg")
        ])
    }

    function initPlayer() {
      player = new Player({
        sence,
      })
    }

    function setEnvironment() {
      const loader = new RGBELoader()
      const pmremGenerator = new Three.PMREMGenerator(renderer)
      pmremGenerator.compileEquirectangularShader()
      loader.load(require("../../../assets/gameSource/hdr/venice_sunset_1k.hdr"), t => {
        const envMap = pmremGenerator.fromEquirectangular(t).texture
        pmremGenerator.dispose()
        sence.environment = envMap
        console.log("TTT", envMap)
      }, undefined, e => {
        console.log('EEEE', e)
      })
    }

    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;//获得当前摄像机缩放比
      camera.updateProjectionMatrix();//更新矩阵
      renderer.setSize( width, height );
    }

    function updateCamera() {
      cameraController.position.copy( player.position );
      cameraController.position.y = 0;
      cameraTarget.copy(player.position);
      cameraTarget.z += 6;
      camera.lookAt( cameraTarget );
    }

    function refresh() {
      const time = clock.getElapsedTime()
      player.update(time)
      updateCamera()
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }