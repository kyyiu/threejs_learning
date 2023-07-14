import React, { useEffect, useRef } from "react";
import * as Three from 'three'

const sence = new Three.Scene();
const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)

camera.position.set(0,0,10)
sence.add(camera)

const renderer = new Three.WebGLRenderer()
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