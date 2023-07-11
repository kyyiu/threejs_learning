import React, { useEffect, useRef } from "react";
import * as Three from 'three'
// 导入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
// 使用gsap动画库
import gsap from 'gsap'
// 
import * as dat from 'dat.gui'

// 创建时钟
const clock = new Three.Clock()
// 创建场景
const sence = new Three.Scene();
// 场景相机
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
)

camera.position.set(0,0,10)
sence.add(camera)
// 添加物体
const cubeGeometry = new Three.BoxGeometry(1,1,1)
const cubeMaterial = new Three.MeshBasicMaterial({color: 0xffff00})
const cube = new Three.Mesh(cubeGeometry, cubeMaterial)

// 修改物体的位置
// 方案1
// cube.position.set(3, 0, 0)
// 方案2
// cube.position.x = 2

// 物体缩放
// cube.scale.set(x, y, z)
cube.scale.x = 2
// 0会消失，z会反过来
// 比如vr看房这种功能
// cube.scale.set(1, 1, -1)
// 会让相机从内部看房的效果

// 物体旋转
// x轴旋转45°
// cube.rotation.set(Math.PI/4, 0, 0)

sence.add(cube)

// 初始化渲染器
const renderer = new Three.WebGLRenderer()
// 创建轨道控制器
// 使相机围绕目标进行轨道移动
// 长按鼠标左键移动查看
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
// 数值渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild()
// 添加坐标轴辅助
// 红色x，绿色y，蓝色z
const axesHelper = new Three.AxesHelper(5)
sence.add(axesHelper)

// 使用gsap设置动画
// gsap.to(cube.position, {x: 5, duration: 5,
//     // 重复次数， -1无限次重复
// // repeat: -1,
// // 来回运动
// // yoyo: true
// })
// gsap.to(cube.rotation, {x: 2 * Math.PI, duration: 5, ease: "power1.in", 
// onStart(){
//     console.log('动画开始')
// },
// onComplete() {
//     console.log("动画完成")
// }})

// window.addEventListener('dblclick', () => {
//     console.log('mmm')
//     const isFullScreen = window.document.fullscreenElement
//     if (isFullScreen) {
//         window.document.exitFullscreen()
//         return
//     }
//     renderer.domElement.requestFullscreen()
// })

let gui
function datguiSetting() {
   gui = new dat.GUI()
//    修改几何属性
   gui.add(cube.position, 'x')
    .min(0)
    .max(5) 
    .step(0.01)
    .name('cube-x轴移动')
    // 变化时触发
    .onChange(v=>{})
    // 变化完成触发
    .onFinishChange(v=>{})

    // 修改颜色
    const c = {
        color: "#fff000",
        fn:() => {
            gsap.to(cube.position, {
                x: 5, 
                repeat: -1,
                duration: 2,
                yoyo: true
            })
        }
    }
    gui.addColor(c, 'color')
        .onChange(v=>{
            cube.material.color.set(v)
        })
    // 是否显示
    gui.add(cube, 'visible').name('是否显示')
    // 点击按钮触发某个事件
    gui.add(c, "fn").name('点击触发')
    // 文件夹设置
    const cubeFolder = gui.addFolder("设置cube")
    cubeFolder.add(cube.material, 'wireframe')
    cubeFolder.add(c, "fn").name('点击触发')
}

export default function() {
  const container = useRef()

  useEffect(() => {
    datguiSetting()
    windowChange()
    container.current.appendChild(renderer.domElement)
    refresh()
    return () => {
      gui.destroy()
    }
  }, [])

  function onFullWindow() {
    const isFullScreen = document.fullscreenElement
    if (isFullScreen) {
        document.exitFullscreen()
        return
    }
    renderer.domElement.requestFullscreen()
  }

  function windowChange() {
    window.addEventListener('resize', ()=>{
        console.log('rrr')
        // 更新摄像机
        camera.aspect = window.innerWidth/window.innerHeight
        // 更新摄像机的投影矩阵
        camera .updateProjectionMatrix()
        // 更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight)
        // 设置渲染器像素比
        renderer.setPixelRatio(window.devicePixelRatio)
    })
  }

  //requestAnimationFrame调用 refresh 时会传入时间作为参数
  // 可以根据这个参数做一个和时间匹配的动画
  function refresh(time) {
    // 获取时钟运行总时长
    // const passedTime = clock.getElapsedTime()
    // // 两次获取时间的间隔
    // // const timeGap = clock.getDelta()
    // const offset = passedTime % 5
    // // const offset = time / 1000 % 5
    // cube.position.x = offset
    controls.update()
    renderer.render(sence, camera)
    window.requestAnimationFrame(refresh)
  }

  return <div ref={container} onDoubleClick={onFullWindow}></div>
}