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

let canvasGeo, canvasContext
export default function() {
    const container = useRef()
  
    useEffect(() => {
      const canvas = document.createElement("canvas")
      canvas.width = 1024
      canvas.height = 1024
      canvasContext = canvas.getContext('2d')
      canvasContext.fillStyle="#ffffff"
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      const texture = new Three.Texture(canvas)
      const g = new Three.PlaneGeometry(12, 12, 4)
      const m = new Three.MeshBasicMaterial({map: texture, transparent: true, opacity: 1, color: 0xffffff})
      canvasGeo = new Three.Mesh(g, m)
      sence.add(canvasGeo)
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function refresh(time) {
      if (canvasGeo) {
        canvasGeo.material.map.needsUpdate = true;
        canvasContext.fillStyle = "rgba("
          +Math.floor(Math.random()*255) + ","
          +Math.floor(Math.random()*255) + ","
          +Math.floor(Math.random()*255) + ","
          +(Math.random() - .1) + ")";
        canvasContext.beginPath();
        canvasContext.arc(1024 * Math.random(), 1024*Math.random(),10 + Math.random() * 50,0,Math.PI*2,true);
        canvasContext.closePath();
	      canvasContext.fill();
      }
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }
  
    return <div ref={container}></div>
  }