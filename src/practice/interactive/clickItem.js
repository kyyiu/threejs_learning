import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

let renderer, sence, camera, cube, animating = false, mounted = false;

export default function() {
    const container = useRef()
  
    useEffect(() => {
      if (mounted) return
      sence = new Three.Scene();
      camera = new Three.PerspectiveCamera(
          45,
          container.current.offsetWidth / container.current.offsetHeight,
          1,
          4000
      )
      
      camera.position.set(0,0,3)
      sence.add(camera)

      const light = new Three.DirectionalLight(0xffffff, 1.5)
      light.position.set(0, 0, 1)
      sence.add(light)
      const loader = new Three.TextureLoader();
      const texture1  = loader.load(require("../../assets/img/react_logo.png"));
      const material = new Three.MeshPhongMaterial({map: texture1})
      
      const geometry = new Three.BoxGeometry(1,1,1)
      cube = new Three.Mesh(geometry, material)
      cube.rotation.x = Math.PI/5;
      cube.rotation.y = Math.PI/5;
      sence.add(cube)
      renderer = new Three.WebGLRenderer({antialias: true, alpha: true})
      renderer.setClearAlpha(0.5)
      addMouseHandler()
      const controls = new OrbitControls(camera, renderer.domElement)
      // 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
      controls.enableDamping = true
      renderer.setSize(container.current.offsetWidth, container.current.offsetHeight)
      container.current.appendChild(renderer.domElement)
      mounted = true;
      refresh()
    }, [])

    function onMouseUp(e) {
      e.preventDefault();
      animating = !animating
    }

    function addMouseHandler() {
      const dom = renderer.domElement;
      dom.addEventListener("mouseup", onMouseUp, false)
    }

    function refresh(time) {
      renderer.render(sence, camera)
      if (animating) {
        cube.rotation.y -= 0.01
      }
      window.requestAnimationFrame(refresh)
    }
  
    return <div>
      <center><h1>Welcom To WebGL</h1></center>
      <div
        id="ccc"
        style={{width: "100%", height: "90%", position: "absolute",zIndex: -1}}
        ref={container}></div>
      <div 
        style={{width: "100%",  height: "6%", bottom: 0, position: "absolute", color: "#fff", textAlign: "center"}}>
        Click to animate the cube    
      </div>
    </div>
  }