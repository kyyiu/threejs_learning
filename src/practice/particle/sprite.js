import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from "gsap";
import { Stats } from "../../utils/stats";
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,10)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
let mounted = false
let tween, stats, isCheck, mouse = new Three.Vector2()
export default function() {
    const container = useRef()
  
    useEffect(() => {
      if (mounted) return
      mounted = true
      init()
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      camera.position.set(0, 0 , 150)
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function init() {
      stats = initStats()
      createSprites()
    }

    function createSprites() {
      for(let x = -5; x< 5;x++) {
        for(let y = -5; y < 5; y++) {
          let m = new Three.SpriteMaterial({color: 0xff0000 * Math.random()})
          let sprite = new Three.Sprite(m)
          let ad = Math.PI / 180 * (360 * Math.random())
          let bd = Math.PI / 180 * (360 * Math.random())
          sprite.position.set(40 * Math.cos(ad)*Math.cos(bd), 40*Math.cos(ad)*Math.sin(bd), 40*Math.sin(ad))
          move(0,0,0, sprite)
          sence.add(sprite)
        }
      }
    }

    function move(mx, my, mz, point) {
      gsap.to(point.position, {
        x: mx,
        y: my,
        z: mz,
        ease: 'circ.inOut',
        duration: 5,
        repeat: -1,
        yoyo: true,
      })
    }

    function initStats() {
      const s = new Stats()
      s.setMode(0)
      s.domElement.style.position = 'absolute'
      s.domElement.style.left = '0px'
      s.domElement.style.top = '0px'
      document.getElementById("Stats-output").appendChild(s.domElement);
      return s
    }



    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;//获得当前摄像机缩放比
      camera.updateProjectionMatrix();//更新矩阵
      renderer.setSize( width, height );
    }

    function refresh(time) {
      stats.update()
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div>
      <div id="Stats-output"></div>
      <div ref={container}></div>
    </div> 
  }