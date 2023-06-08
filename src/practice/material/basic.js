import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,10)
sence.add(camera)

// 导入纹理
const txtLoader = new Three.TextureLoader();
const reactLogoTexture = txtLoader.load(require("../../assets/img/react_logo.png"))
// 设置纹理显示算法
// 取最接近的
// 缩小滤镜
reactLogoTexture.minFilter = Three.NearestFilter;
// 放大滤镜
reactLogoTexture.magFilter = Three.NearestFilter;
// 透明滤镜
// 一张图片，要完全透明的地方使用黑色0，完全显示的地方使用白色1
const aplhaTexture = txtLoader.load("")
// 材质
const basicMaterial = new Three.MeshBasicMaterial({
    color: "#fff000",
    map: reactLogoTexture,
    // 自定义透明需要同时设置下面两个属性
    // transparent: true,
    // alphaMap: aplhaTexture
    // 渲染哪一面
    // side: Three.DoubleSide
})

const cube = new Three.Mesh(new Three.BoxBufferGeometry(1,1,1), basicMaterial)
sence.add(cube) 
// 添加平面
const plane = new Three.Mesh(new Three.PlaneGeometry(1,1), basicMaterial)
plane.position.set(3, 0, 0)
sence.add(plane)
const renderer = new Three.WebGLRenderer()
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)

export default function() {
    const container = useRef()
  
    useEffect(() => {
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function refresh(time) {
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }