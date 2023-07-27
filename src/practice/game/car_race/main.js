import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import styles from './main.module.css'
import { initGame, initSound } from "./init";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const sence = new Three.Scene();
let camera
const renderer = new Three.WebGLRenderer({alpha: true})
// renderer.setClearAlpha = 0.5
const axesHelper = new Three.AxesHelper(5)
sence.add(axesHelper)

let sounds, speedometer, tachometer, mounted

export default function() {
    const container = useRef()
  
    useEffect(() => {
      if (mounted) {
        return
      }
      mounted = true
      try {
        const timer = document.getElementById ('elapsedTime');
        const odometer = document.getElementById ('odometer');
        const kmph = document.getElementById ('kmph');
        const rpm = document.getElementById ('rpm');
        sounds = initSound() 
        camera = new Three.PerspectiveCamera(45, container.current.offsetWidth / container.current.offsetHeight, 1, 10000)
        camera.position.set( 0, 0, 3.3333 );
        const controls = new OrbitControls(camera, renderer.domElement)
        // 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
        controls.enableDamping = true
        sence.add(camera)
        initGame({
          sence,
          camera,
          sounds,
        })
        timer.style.display = 'block';
        odometer.style.display = 'block';
        kmph.style.display = 'block';
        rpm.style.display = 'block';
      } catch (e) {
        container.current.innerHTML = e.toString();
        return
      }
      renderer.setSize(container.current.offsetWidth, container.current.offsetHeight);
      camera.aspect = container.current.offsetWidth / container.current.offsetHeight;
      container.current.appendChild(renderer.domElement)
      window.addEventListener('resize', () => {
        renderer.setSize(container.current.offsetWidth, container.current.offsetHeight);
        camera.aspect = container.current.offsetWidth / container.current.offsetHeight;
        camera.updateProjectionMatrix();
      }, false)
      refresh()
    }, [])

    function refresh(time) {
      renderer.render(sence, camera)
      window.requestAnimationFrame(refresh)
    }

    function onRestartClicked() {

    }
  
    return <div>
      <center><h1>Road Race!</h1></center>
      <div ref={container} className={styles.container}></div>
      <div id="kmph">
        km/h
          <div id="speedometer"></div>
      </div>
        <div id="rpm">
        rpm
          <div id="tachometer"></div>
      </div>
      <div id="odometer">
        0.00
      </div>
      <div id="elapsedTime">
        0.00
      </div>
      <div className={styles.overlay} >
      <div className={styles.header}>RACE COMPLETE</div>
      <div className={styles.contents}>
        ELAPSED TIME: 42.43s<br></br>
        BEST TIME: 39.31s
        </div>
        <div className={styles.restartButton}><button onClick={onRestartClicked}>Restart</button></div>
      </div>
      <audio id="driving" className={styles.driving} loop>
        <source src={require("./media/audio/50910__rutgermuller__in-car-driving.wav")} type="audio/wav" />
        Your browser does not support WAV files in the audio element.
      </audio>
      <audio id="rev_short" className={styles.rev_short} >
        <source src={require("./media/audio/rev-short.wav")} type="audio/wav" />
        Your browser does not support WAV files in the audio element.
      </audio>
      <audio id="rev_long" className={styles.rev_long} >
        <source src={require('./media/audio/rev-trimmed.wav')} type="audio/wav" />
        Your browser does not support WAV files in the audio element.
      </audio>
      <audio id="bounce" className={styles.bounce} >
        <source src={require('./media/audio/bounce.wav')} type="audio/wav" />
        Your browser does not support WAV files in the audio element.
      </audio>
      <audio id="crash" className={styles.crash} >
        <source src={require('./media/audio/crash-trimmed.wav')} type="audio/wav" />
        Your browser does not support WAV files in the audio element.
      </audio>
    </div>
  }