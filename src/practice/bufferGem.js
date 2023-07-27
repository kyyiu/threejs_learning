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
// 0xffffff使用的是颜色的十六进制表示法，代表白色。1代表的是near（近处）属性值，10代表的是far（远处）属性值。这两个属性确定了雾化效果的起始位置以及浓度加深的程度。
sence.fog = new Three.Fog(0xffffff, 1, 10)

camera.position.set(0,0,10)
sence.add(camera)

for(let i = 0; i<50;i++) {
    const geometry = new Three.BufferGeometry();
    const positionArr = new Float32Array(9);
    for(let j = 0;j <9; j++) {
        positionArr[j] = Math.random() * 10 - 5;
    }
    geometry.setAttribute("position", new Three.BufferAttribute(positionArr, 3))
    let color = new Three.Color(Math.random(),Math.random(),Math.random())
    const material = new Three.MeshBasicMaterial({color, transparent: true, opacity: 0.5})
    const mesh = new Three.Mesh(geometry, material)
    sence.add(mesh)
}

const renderer = new Three.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true

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