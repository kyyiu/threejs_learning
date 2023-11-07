import React, { useEffect, useRef, useState } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100000
)

camera.position.set(1000, 1000, 1000)
sence.add(camera)

const renderer = new Three.WebGLRenderer({
  antialias: true, // 抗锯齿
  logarithmicDepthBuffer: true, // 防止地面和物体过近出现闪烁
})
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
const self = {}
export default function () {
  const container = useRef()
  const [clicked, setClicked] = useState([])
  useEffect(() => {
    window.addEventListener('resize', onWindowResize, false);//窗口变化监听
    init()
    container.current.appendChild(renderer.domElement)
    refresh()
  }, [])
  useEffect(() => {
    const div = document.querySelector('.panel'); 
    div.scrollTop = div.scrollHeight; 
  }, [clicked])

  function init() {
    self.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    self.loader.setDRACOLoader(dracoLoader)
    self.loader.load('/model/city.glb', gltf => {
      sence.add(gltf.scene)
    })
    const hdrLoader = new RGBELoader()
    hdrLoader.loadAsync(require('../vr_house/hdr/h.hdr')).then(texture => {
      sence.background = texture // 类似天空盒子
      sence.environment = texture //纹理贴图将会被设为场景中所有物理材质的环境贴图
      // 环境映射，用于等距圆柱投影的环境贴图，也被叫做经纬线映射贴图。
      // 等距圆柱投影贴图表示沿着其水平中线360°的视角，以及沿着其垂直轴向180°的视角。
      // 贴图顶部和底部的边缘分别对应于它所映射的球体的北极和南极。
      sence.environment.mapping = Three.EquirectangularReflectionMapping
    })
    renderer.shadowMap.enabled = true
    // hdr环境贴图
    // renderer.toneMapping = THREE.NoToneMapping
    // 普通环境贴图
    renderer.toneMapping = Three.ACESFilmicToneMapping
    // 光照渲染强度
    renderer.toneMappingExposure = 1.5
    initLight()
  }

  function initLight() {
    const light = new Three.DirectionalLight(0xffffff, 1)
    light.position.set(10,100,10)
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // raycaster只对mesh对象有感应，而导入的模型基本是group的，
    // 所以intersectObject的第二个参数必须为true，要检查后代才能拿到该模型。
    // 如果目标模型的同级模型干扰严重，也可以采用在模型外部新建一个透明的mesh进行包裹绑定
    camera.aspect = width / height;//获得当前摄像机缩放比
    camera.updateProjectionMatrix();//更新矩阵
    renderer.setSize(width, height);
  }

  function refresh(time) {
    renderer.render(sence, camera)
    window.requestAnimationFrame(refresh)
  }

  function handleClick(e) {
    const raycaster = new Three.Raycaster()
    const pointer   = new Three.Vector2()
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
    pointer.x = (e.clientX / window.innerWidth) * 2 -1
    pointer.y = -(e.clientY/window.innerHeight) * 2 +1 
    raycaster.setFromCamera(pointer, camera)
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects( sence.children );
    // for (let i = 0; i < intersects.length; i++) {
    //   intersects[i].object.material.color.set(0xff0000);
    // }
    if (intersects.length) {
      setClicked([...clicked, intersects[0].object.name])
    }
    console.log("click---", intersects)
  }

  return <div style={{position: 'relative'}}>
    <div ref={container} onClick={handleClick}></div>
    <div className="panel" style={{position: 'absolute', right: 0, top: 0, height: '250px', width: '200px', overflow: 'auto', background: 'rgba(255,255,255, .8)'}}>
      <div>点击记录</div>
      {
        clicked.map((e, i) => {
          return <div key={i}>点击了{e}</div>
        })
      }
    </div>
  </div>
}