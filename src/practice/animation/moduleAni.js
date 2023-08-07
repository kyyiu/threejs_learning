import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    50
)
sence.background = new Three.Color(0x605550)
const clock = new Three.Clock();
camera.position.set(1,1.7,2.8)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
// renderer.outputEncoding = Three.sRGBEncoding
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 1, 0)
controls.update()
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
let eve, mixer,animations = {}, actionName = '', action, curAction
export default function() {
    const container = useRef()
  
    useEffect(() => {
      initLight()
      initEve()
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function initEve() {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      // 把node_modules\three\examples\jsm\libs\draco文件夹复制到public
      dracoLoader.setDecoderPath('./draco/') //注意最后还有一个分号
      loader.setDRACOLoader(dracoLoader)
      loader.load(
        require("../../assets/gameSource/factory/eve.glb"),
        glft => {
          sence.add(glft.scene)
          eve = glft.scene
          mixer = new Three.AnimationMixer(glft.scene)
          glft.animations.forEach(ani => {
            animations[ani.name.toLocaleLowerCase()] = ani
          })
          newAni()
        }
      )
    }

    function newAni() {
      const kes = Object.keys(animations)
      let idx
      do {
        idx = Math.floor(Math.random() * kes.length)
      } while(kes[idx] === actionName)
      setAction( kes[idx] )
      setTimeout(newAni, 3000)
    }

    function setAction(name) {
      if (actionName === name.toLocaleLowerCase()) return
      const clip = animations[name.toLocaleLowerCase()]
      if (clip !== undefined) {
        const action = mixer.clipAction(clip)
        if (name === 'shot') {
          action.clampWhenFinished = true
          action.setLoop(Three.LoopOnce)
        }
        action.reset()
        const nofade = actionName === 'shot'
        actionName = name.toLocaleLowerCase()
        action.play()
        if (curAction) {
          if (nofade) {
            curAction.enabled = false
          } else {
            curAction.crossFadeTo(action, 0.5)
          }
        }
        curAction = action
      }
    }

    function initLight() {
      const ambient = new Three.HemisphereLight(0xffffff, 0xbbbbff, 1)
      sence.add(ambient)
      const light = new Three.DirectionalLight()
      light.position.set(0.2, 1, 1)
    }

    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;//获得当前摄像机缩放比
      camera.updateProjectionMatrix();//更新矩阵
      renderer.setSize( width, height );
    }

    function refresh(time) {
      const dt = clock.getDelta()
      if (mixer !== undefined) {
        mixer.update(dt)
      }
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }


