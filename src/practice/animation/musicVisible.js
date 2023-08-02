import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import styles from './musicVisible.module.css'
const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 40, 270)
camera.lookAt(new Three.Vector3(0,0,0))
sence.add(camera)

const renderer = new Three.WebGLRenderer({ antialias: true })
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = Three.PCFShadowMap
let file // 文件dom对象
let fileUrl //文件链接
let fftSize = 32 // 音乐数据频域长度
let analyser //音乐数据
let musicleDataArray = new Array(16) // 音乐数据数组
let plane // 地板
let dirLight // 光照
let material
let mesh = []
let tempGeometry = new Array(fftSize)
let audioObj
export default function () {
  const container = useRef()

  useEffect(() => {
    addFloor()
    addLight()
    window.addEventListener('resize', onWindowResize, false);//窗口变化监听
    container.current.appendChild(renderer.domElement)
    return () => {
      analyser = null
    }
  }, [])

  function addLight() {
    var target = new Three.Object3D();
    // target.position = new Three.Vector3(0, 0, 0);

    //生成一个方向光，模拟太阳光
    var pointColor = "#bbbbbb";
    dirLight = new Three.DirectionalLight(pointColor);
    dirLight.position.set(0, 50, 50);
    dirLight.castShadow = true;
    dirLight.target = plane;

    dirLight.shadow.CameraNear = 0.1;
    dirLight.shadow.CameraFar = 100;
    dirLight.shadow.CameraTop = 200;
    dirLight.shadow.CameraBottom = 0;
    dirLight.shadow.MapWidth = 2048;
    dirLight.shadow.MapHeight = 2048;
    var dirLight0 = dirLight.clone();
    dirLight0.position.set(0, 50, -50);
    sence.add(dirLight0);
    sence.add(dirLight);
    var ambientLight = new Three.AmbientLight("#0c0c0c");//创建环境光
    sence.add(ambientLight);
  }

  function addFloor() {

    var planeGeometry = new Three.PlaneGeometry(500, 500);
    var planeMaterial = new Three.MeshLambertMaterial({ color: 0xaaaaaa });
    plane = new Three.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -Math.PI / 2;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow = true;
    sence.add(plane);
  }

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;//获得当前摄像机缩放比
    camera.updateProjectionMatrix();//更新矩阵
    renderer.setSize(width, height);
  }

  function refresh(time) {
    if (!analyser) {
      return
    }
    renderer.render(sence, camera)
    window.requestAnimationFrame(renderAudio)
  }

  //随机颜色方法
  function getColor() {
    var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    var colorArray = colorElements.split(",");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += colorArray[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function addAudio() {
    // 创建音频加载
    const audioLoader = new Three.AudioLoader()
    // 创建音频监听
    const listener = new Three.AudioListener()
    // 创建音频对象
    const audio = new Three.Audio(listener)
    audioObj = audio
    audioLoader.load(fileUrl, function (audioBuffer) {
      // 设置音频数据
      audio.setBuffer(audioBuffer)
      // 音频循环
      audio.setLoop(true)
      // 音频播放
      audio.play()
    })
    // 音频数据分析
    analyser = new Three.AudioAnalyser(audio, fftSize)
    musicleDataArray = analyser.data
    for (let i = 0; i < fftSize * 0.5; i++) {
      tempGeometry[i] = new Three.BoxGeometry(12, 2, 12)
      material = new Three.MeshPhongMaterial({ color: getColor() })
      mesh[i] = new Three.Mesh(tempGeometry[i], material)
      mesh[i].position.x = 20 * i - 160
      mesh[i].castShadow = true
      mesh[i].rotation.y = Math.PI / 4
      sence.add(mesh[i])
    }
    renderAudio()
  }
  function renderAudio() {
    if (!analyser) {
      audioObj.stop()
      return
    }
    // 更新音乐数据
    analyser.getFrequencyData()
    musicleDataArray = analyser.data
    // 更改y缩放比例
    for (let i = 0; i < fftSize * 0.5; i++) {
      if (musicleDataArray[i] / 4 === 0) {
        musicleDataArray[i] = 4
      }
      mesh[i].scale.y = musicleDataArray[i] / 4
      mesh[i].position.y = 0
    }
    refresh()
  }
  function fileChange() {
    file = document.getElementById('importFile').files[0]
    // 创建文件链接
    fileUrl = URL.createObjectURL(file)
    container.current.style.display="block";
    //将打开文件Label隐藏
    document.getElementById("label1").style.display = "none";
    addAudio()
  }

  return <div>
    <label htmlFor="importFile" className={styles.file} id="label1"> 打开本地音频文件
      <input type="file" className={styles.importFile} id="importFile" accept="audio/*" onChange={fileChange} />
    </label>
    <div ref={container} style={{ display: 'none' }}></div>
  </div>
}