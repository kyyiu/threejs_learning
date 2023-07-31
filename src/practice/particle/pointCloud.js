import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.set(20, 0, 150)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
const controls_o = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls_o.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
let cloud, controls, gui, step = 0

let xm 

export default function () {
  const container = useRef()

  useEffect(() => {
    // init2(container)
    // refresh()
    // return
    init()
      // createParticles(15,)
    window.addEventListener('resize', onWindowResize, false);//窗口变化监听
    container.current.appendChild(renderer.domElement)
    refresh()
  }, [])

  function init() {
    // sence.fog = new Three.Fog(0xffffff, 1, 10)
    controls = new function () {
      this.size = 8
      this.transparent = true
      this.opacity = 0.6
      this.vertexColors = true
      this.color = 0xffffff
      this.sizeAttenuation = true;
      this.rotateSystem = true
      this.redraw = function () {
        if (sence.getObjectByName("particles")) {
          sence.remove(sence.getObjectByName("particles"))
        }
        createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color)
      }
    }

    gui = new dat.GUI()
    gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.add(controls, 'vertexColors').onChange(controls.redraw);
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
    gui.add(controls, 'rotateSystem');

    controls.redraw();
  }

  function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation) {
    // color =  new Three.Color(color)
    const g = new Three.BufferGeometry()
    xm = new Three.PointsMaterial({
      size: size,
      map: new Three.TextureLoader().load(require("./imgs/snow.png"), t => t.colorSpace = Three.SRGBColorSpace),
      // transparent: transparent,
      // opacity: opacity,
      color: 0xff0000,
      //sizeAttenuation false ��Сһ�� �������λ���޹�
      //true ����ԶС
      // sizeAttenuation: sizeAttenuation,
      // color: color, // 粒子系統中所有粒子的材質顏色。若 vertexColors 設為 true，則會將此值乘以頂點顏色得到最終呈現的顏色。預設為 0xffffff 白色。
      blending: Three.AdditiveBlending, // 渲染材質時的融合模式。用來調整載入的材質如何與背景融合。THREE.AdditiveBlending，就是在渲染粒子時背景的顏色會被添加到粒子的背景上
      depthTest: false //  depthTest 有關掉的話，會將融合模式中吃到的背景色，在兩片雪花疊加時有透明效果而不會被遮擋住。
    })
    // m.color.setHSL(0.1, 0.2, 0.5, Three.SRGBColorSpace)
    const range = 500
    const arr = []
    for (let i = 0; i < 1500; i++) {
      arr.push(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2)
    }
    // const vertices = new Float32Array(arr)
    g.setAttribute('position', new Three.Float32BufferAttribute(arr, 3))
    cloud = new Three.Points(g, xm)
    cloud.name = 'particles'
    sence.add(cloud)
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;//获得当前摄像机缩放比
    camera.updateProjectionMatrix();//更新矩阵
    renderer.setSize(width, height);
  }

  function refresh() {
    // const time = Date.now() * 0.0005;
    // const color = [ 1.0, 0.2, 0.5 ];
    // const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
    // xm.color.setHSL( h, color[ 1 ], color[ 2 ])
    // // renderer.render(scene, camera)
    // renderer.render(sence, camera)
    // window.requestAnimationFrame(refresh)
    // return
    
    if (controls.rotateSystem) {
      step += 0.001
      const time = Date.now() * 0.00005;
      const c = [0.95, 0.1, 0.5]
      const h = (360 * ((c[0] + time) % 360)) / 360;
      xm.color.setHSL( h, c[1], c[2], Three.SRGBColorSpace)
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }
    renderer.render(sence, camera)
    window.requestAnimationFrame(refresh)
  }

  return <div ref={container}></div>
}