import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import styles from './popDialog.module.css'

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,10)
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
sence.add(camera)

const light = new Three.DirectionalLight( 0xffffff, 3 );
light.position.set( 1, 1, 1 ).normalize();
sence.add( light );

const g = new Three.BoxGeometry(1, 1, 1)
const m = new Three.MeshLambertMaterial({color: Math.random() * 0xffffff })
const cube = new Three.Mesh(g, m)
const g2 = new Three.BoxGeometry(1, 1, 1)
const m2 = new Three.MeshLambertMaterial({color: Math.random() * 0xffffff })
const cube2 = new Three.Mesh(g2, m2)
cube2.position.set(2,2,2)
sence.add(cube)
sence.add(cube2)

const renderer = new Three.WebGLRenderer({alpha: true})
renderer.setClearAlpha(0.5)
renderer.setPixelRatio( window.devicePixelRatio );
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)

let raycaster,pointer, curObj
export default function() {
    const container = useRef()
    const callOut = useRef()
  
    useEffect(() => {
      raycaster = new Three.Raycaster()
      pointer   = new Three.Vector2()
      container.current.appendChild(renderer.domElement)
      container.current.addEventListener("click", onPointerMove, false)
      refresh()
    }, [])

    function getObjectScreenPosition(object)
    {	
      // var pos = new Three.Vector3();
      // pos = pos.clone().applyMatrix4(object.matrix);
    
      // // const projected = pos.clone();
      // const projected = pos;
      // 物体坐标转屏幕坐标
      // 参考 https://stackoverflow.com/questions/27409074/converting-3d-position-to-2d-screen-position-r69
      const v = new Three.Vector3();
      object.updateMatrixWorld();
      v.setFromMatrixPosition(object.matrixWorld)
      v.project(camera)
      var widthHalf = 0.5* renderer.domElement.width;
      var heightHalf = 0.5* renderer.domElement.height;
    
      // var eltx = (1 + projected.x) * container.current.offsetWidth / 2 ;
      // var elty = (1 - projected.y) * container.current.offsetHeight / 2;
      var eltx = ( v.x * widthHalf ) + widthHalf;
      var elty = - ( v.y * heightHalf ) + heightHalf;
      
      var offset = renderer.domElement;	
      eltx += offset.offsetLeft;
      elty += offset.offsetTop;
        
      return { x : eltx, y : elty };
    }

    function onPointerMove(e) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      pointer.x = (e.clientX / window.innerWidth) * 2 -1
      pointer.y = -(e.clientY/window.innerHeight) * 2 +1 
      raycaster.setFromCamera(pointer, camera)
      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects( sence.children, false );
      if (intersects.length) {
        curObj = intersects[0]
        console.log('EEE',curObj)
        const screenpos = getObjectScreenPosition(curObj.object);
        console.log('EEE2',curObj)
        curObj.object.material.emissive.setHex(0xff0000)
        callOut.current.style.display = 'block'
        console.log("CCCC", (screenpos.x - callOut.current.offsetWidth / 2)+ "px",  `${screenpos.y + 100}px`)
        callOut.current.style.left = (screenpos.x - callOut.current.offsetWidth / 2)+ "px";
        callOut.current.style.top = `${screenpos.y + 100}px`
      } else {
        if (curObj) {
          curObj.object.material.emissive.setHex(0x0000ff)
          curObj = null
        }
      }
    }

    function refresh(time) {
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }

    function onSelectClicked() {
      const dom = callOut.current
      if (dom) {
        dom.style.display = 'none'
      }
    }
  
    return <div>
      <h1 style={{display: 'none'}}>Shipster - Choose Your Ship</h1>
      <div className={styles.container}  ref={container}></div>
      <div className={styles.callout} ref={callOut}>
        <div className={styles.header}>我是弹窗</div>
        <div className={styles.contents}>我是介绍</div>
        <div className={styles.selectButton}><button onClick={onSelectClicked}>关闭</button></div>
      </div>
    </div>
  }