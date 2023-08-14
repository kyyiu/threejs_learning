import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import styles from './drawOnCanvas.module.css'
const sence = new Three.Scene()
const camera = new Three.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,700)
sence.add(camera)

const renderer = new Three.WebGLRenderer({antialias: false})
renderer.setClearColor(new Three.Color(0x000000))
renderer.setSize(window.innerWidth, window.innerHeight)
let startPosition = new Three.Vector2() // 存放开始坐标二维位置
let mesh = new Array(6) // 球体
let mixer
let paint = false // 画笔移动标志位
let moveFlag = false // 鼠标移动标志
let drawingCanvas = new Array(6) // canvas对象数组
let rgbV3Arr = new Array(6)
let mousePoint = new Three.Vector2()
let axis = [] // 新建容器
let ray// 射线拾取
let canvas = new Array(6) // canvas 2d context 数组 ，
let material = new Array(6) // 纹理
let mounted = false
export default function() {
    const container = useRef()
  
    useEffect(() => {
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      addControls()
      addLight()
      addSupport()
      addMesh()
      canvasDrawing()
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function addControls() {
      const controls = new OrbitControls(camera, renderer.domElement)
      // 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
      controls.enableDamping = true 
      // controls.addEventListener('change', )
      controls.minDistance = 3
      controls.maxDistance = 1000
      controls.enablePan = true // 是否可以平移
      controls.zoomSpeed = 3.0 // 设置缩放比例
      controls.addEventListener("change", function() {
        moveFlag = true // 鼠标移动物体， 标志修改
      })
      container.current.addEventListener('mousedown', function() {
        moveFlag=false // 鼠标点击
      })
      container.current.addEventListener('mouseup', function() {
        mouseCollect()
      })
      setTimeout(() => {
        container.current.addEventListener('mousemove', mouseMove)
        container.current.addEventListener('touchmove', mouseMove)
      }, 70);
    }
    function mouseMove(e) {
      if (!mesh) {
        return
      }
      let x, y
      // 获得移动设备的触摸改变的值
      if (e.changedTouches) {
        x = e.changedTouches[ 0 ].pageX;//获得x坐标
        y = e.changedTouches[ 0 ].pageY;//获得y坐标
      } else {
        x = e.clientX;//获得鼠标的x坐标
        y = e.clientY;//获得y坐标
      }
      mousePoint.x = (x / window.innerWidth) * 2 -1 //转变为笛卡尔坐标
      mousePoint.y = -(y / window.innerHeight) *2 +1
    }
    function addLight() {
      const spotLight = new Three.SpotLight('0xffffff')
      spotLight.position.set(camera.position)
      sence.add(spotLight)
      const ambientLight = new Three.AmbientLight(0x404040)
      sence.add(ambientLight)
    }

    function getColor() {
      var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
      var colorArray = colorElements.split(",");
      var color ="#";
      for(var i =0;i<6;i++){
          color+=colorArray[Math.floor(Math.random()*16)];
      }
      return color;
    }
    //获取对应的canvas 并将其作为纹理图添加进对应材质中
    function canvasDrawing() {
      for (let i = 0; i<6;i++) {
        drawingCanvas[i] = document.getElementById('canvas'+i)
        canvas[i] = drawingCanvas[i].getContext('2d')
        canvas[i].fillStyle = rgbV3Arr[i];
        canvas[i].fillRect( 0, 0, 256, 256 );
        material[i].map = new Three.Texture( drawingCanvas[i] );
        //更新纹理图时自动获取canvas内容
        material[i].map.needsUpdate = true;
      }
    }
    function addMesh() {
      const meshLength = 200
      for(let i = 0;i<material.length; i++) {
        rgbV3Arr[i] = getColor()
        material[i] = new Three.MeshBasicMaterial({color: rgbV3Arr[i]})
        material[i].side = Three.DoubleSide
        mesh[i] = new Three.Mesh(new Three.PlaneGeometry(meshLength, meshLength), material[i])
      }
      mesh[0].position.x=0;
      mesh[0].position.y=0;
      mesh[0].position.z=0;
      mesh[0].name='0';
      sence.add(mesh[0]);
      mesh[1].position.x=0;
      mesh[1].position.y=0;
      mesh[1].position.z=-200;
      mesh[1].name='1';
      sence.add(mesh[1]);
      mesh[3].rotation.x=-Math.PI/2;
      mesh[3].position.x=0;
      mesh[3].position.y=100;
      mesh[3].position.z=-100;
      mesh[3].name='3';
      sence.add(mesh[3]);
      mesh[4].rotation.x=-Math.PI/2;
      mesh[4].position.x=0;
      mesh[4].position.y=-100;
      mesh[4].position.z=-100;
      mesh[4].name='4';
      sence.add(mesh[4]);
      mesh[5].rotation.y=-Math.PI/2;
      mesh[5].position.x=-100;
      mesh[5].position.y=0;
      mesh[5].position.z=-100;
      mesh[5].name='5';
      sence.add(mesh[5]);
      mesh[2].rotation.y=-Math.PI/2;
      mesh[2].position.x=100;
      mesh[2].position.y=0;
      mesh[2].position.z=-100;
      mesh[2].name='2';
      sence.add(mesh[2]);
    }
    function addSupport() {
      ray = new Three.Raycaster()
    }
    function mouseCollect() {
      ray.setFromCamera(mousePoint, camera)
      const interSection = ray.intersectObjects(sence.children)
      setTimeout(() => {
        if (interSection.length > 0) {
          const name = interSection[0].object.name
          canvasChange(name) // 变更canvas，改变当前展示的canvas
          drawingCanvas[name].addEventListener('mousedown', function(e) {
            paint = true
            startPosition.set(e.offsetX, e.offsetY)
          })
          // canvas中鼠标移动监听
          drawingCanvas[name].addEventListener('mousemove', function(e) {
            if (paint) {
              draw(canvas[name], e.offsetX, e.offsetY, (name))
            }
          })
          // 鼠标up监听, 更改画画状态
          drawingCanvas[name].addEventListener('mouseup', function(e) {
            paint = false
          })
          // 鼠标离开canvas
          drawingCanvas[name].addEventListener('mouseleave', function(e) {
            paint = false
          })
        }
      }, 100);
    }
    function draw(drawContext, x, y,i) {
      drawContext.moveTo(startPosition.x, startPosition.y)
      drawContext.strokeStyle = '#000000'
      drawContext.lineTo(x, y)
      drawContext.stroke()
      startPosition.set(x, y)
      material[i].map.needsUpdate = true // 更新纹理
    }
    function canvasChange(name) {
      for (let i = 0;i<6;i++) {
        if (name != i) {
          document.getElementById("canvas"+i).style.display = 'none'
        } else {
          document.getElementById("canvas"+name).style.display = 'block'
        }
      }
    }

    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;//获得当前摄像机缩放比
      camera.updateProjectionMatrix();//更新矩阵
      renderer.setSize( width, height );
    }

    function refresh(time) {
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div>
      <canvas className={styles.canvas0} id="canvas0" height="256" width="256"></canvas>
      <canvas className={styles.canvas1} id="canvas1" height="256" width="256"></canvas>
      <canvas className={styles.canvas2} id="canvas2" height="256" width="256"></canvas>
      <canvas className={styles.canvas3} id="canvas3" height="256" width="256"></canvas>
      <canvas className={styles.canvas4} id="canvas4" height="256" width="256"></canvas>
      <canvas className={styles.canvas5} id="canvas5" height="256" width="256"></canvas>
      <div ref={container}></div>
    </div>
  }