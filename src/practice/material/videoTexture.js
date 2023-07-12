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

const light = new Three.DirectionalLight( 0xffffff, 3 );
light.position.set( 0.5, 1, 1 ).normalize();
sence.add( light );


const renderer = new Three.WebGLRenderer({alpha: true})
renderer.setClearAlpha = 0.5
const controls = new OrbitControls(camera, renderer.domElement)
// 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
controls.enableDamping = true
renderer.setSize(window.innerWidth, window.innerHeight)

const vedioArr = [
  require('../../assets/videos/Anniversary.ogv')
]

const Vedio = function({videoSrc, idx}) {
  return <video id={`vedio${idx}`} width="750" height="500" controls className="dn" loop>
    <source 
      src={videoSrc}
      type='video/ogg; codecs="theora, vorbis"'
    ></source>
  </video>
}

let vedioDom, playing, cube, mounted;

export default function() {
    const container = useRef()
  
    useEffect(() => {
      if (mounted) {
        return
      }
      mounted = true
      vedioDom = document.getElementById("vedio1")
      vedioDom.play()
      playing = true;
      const box = new Three.BoxGeometry(5,5,5)
      const textur = new Three.VideoTexture(vedioDom)
      const m = new Three.MeshLambertMaterial({map: textur, color: 0xffffff})
      cube = new Three.Mesh(box, m)
      sence.add(cube)
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function refresh(time) {
      if (cube) {
        cube.rotation.y += 0.01
        cube.rotation.x += 0.01
      }
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }

    function togglePlay() {
      console.log('zzz', vedioDom)
      if (vedioDom) {
        if (playing) {
          vedioDom.pause();
        } else {
          vedioDom.play();
        }
      }
      playing = !playing
    }
  
    return <div onClick={togglePlay}>
      <div style={{position: 'absolute', width: '100%', textAlign: 'center', marginTop: '40px'}}>点击暂停/播放</div>
      {
        vedioArr.map((e, i) => <Vedio videoSrc={e} key={i} idx={i+1}/>)
      }
      <div ref={container}></div>
    </div>
  }