import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { Player } from "./Player";
import styles from './plane.module.css'

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
    const info = {
      spaceKey:false,
      active: false,
      sence
    }
    const container = useRef()
  
    useEffect(() => {
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      container.current.appendChild(renderer.domElement)
      init()
      refresh()
      return () => {
        document.removeEventListener('keydown', keyDown)
        document.removeEventListener('keyup', keyUp)
      }
    }, [])

    function init() {
      setEnvironment()
      initSkyBox()
      initPlayer()
      initEvent()
    }

    function initEvent() {
      document.addEventListener('keydown', keyDown)
      document.addEventListener('keyup', keyUp)
      container.current.addEventListener('mousedown', mouseDown)
      container.current.addEventListener('mouseup', mouseup)
    }

    function mouseDown() {
      info.spaceKey = true
    }

    function mouseup() {
      info.spaceKey = false
    }

    function keyDown(e) {
      switch (e.keyCode) {
        case 32:
          info.spaceKey = true
      }
    }
    function keyUp(e) {
      switch (e.keyCode) {
        case 32:
          info.spaceKey = false
      }
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
      player = new Player(info)
    }

    function setEnvironment() {
      const loader = new RGBELoader()
      const pmremGenerator = new Three.PMREMGenerator(renderer)
      pmremGenerator.compileEquirectangularShader()
      loader.load(require("../../../assets/gameSource/hdr/venice_sunset_1k.hdr"), t => {
        const envMap = pmremGenerator.fromEquirectangular(t).texture
        pmremGenerator.dispose()
        sence.environment = envMap
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
  
    function start() {
        const instructions = document.getElementById('instructions');
        const btn = document.getElementById('playBtn');

        instructions.style.display = 'none';
        btn.style.display = 'none';

        info.active = true;
    }

    return <div>
      <p className={styles.instructions} id="instructions">操作：长按空格或者鼠标</p>
      <div id="info" className={styles.info}>
        <div id="life" className={styles.life}>
          <img className={styles.info_img} src={require("../../../assets/gameSource/plane/plane-icon.png")}/>
          <div id="lives" className={styles.lives}>3</div>
        </div>
        <div id="score_panel" className={styles.score_panel}>
          <div className={styles.score}>0</div>
          <img className={styles.info_img} src={require("../../../assets/gameSource/plane/star-icon.png")}/>
        </div>
      </div>
      <p id="gameover" className={styles.gameover}>Game Over</p>
      <button className={styles.playBtn} id="playBtn" onClick={start}>开始</button>
      <div ref={container}></div>
    </div>
  }