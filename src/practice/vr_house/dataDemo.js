import React, { useEffect, useRef } from "react";
import * as Three from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import styles from './dataDemo.module.css'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

export default function() {

    const sence = new Three.Scene();
    const camera = new Three.PerspectiveCamera(
        25,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    )

    camera.position.set(-20,0,0)
    camera.lookAt(0, 0 , 0)
    sence.add(camera)

    const renderer = new Three.WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)
    // 设置阻尼，让控制器更真实, 必须在动画循环调用update方法
    controls.enableDamping = true
    renderer.setSize(window.innerWidth, window.innerHeight)

    const self = {
      mouse: new Three.Vector2(),
      composer: null,
      effectFXAA: null, 
      outlinePass: null,
      visibleEdgeColor: '#00ff00',
      hiddenEdgeColor: '#190a05',
      selectedObjects: []
    }

    const container = useRef()
  
    useEffect(() => {
      init()
      window.addEventListener( 'resize', onWindowResize, false );//窗口变化监听
      container.current.appendChild(renderer.domElement)
      refresh()
    }, [])

    function init() {
      initLight()
      initSkybox()
      initRaycaster()
      initModel()
      initEdgeAttr()
      initEvent()

      const g = new Three.BoxGeometry()
      const gm = new Three.Mesh(g, new Three.MeshBasicMaterial({color: '#ff0000'}))
      gm.position.set(3, 2, 0)
      sence.add(gm)
    }

    function initLight() {
      const ambient = new Three.AmbientLight(0xffffff, 0.5)
      sence.add(ambient)
      const light = new Three.DirectionalLight(0xffffff)
      light.position.set(0, 200, 100)
      light.castShadow = true
      light.shadow.camera.top = 180
      light.shadow.camera.bottom = -100
      light.shadow.camera.left = -120
      light.shadow.camera.right = 400
      light.shadow.camera.near = 0.1
      light.shadow.camera.far = 400
      // mapsize 使阴影更清晰
      light.shadow.mapSize.set(1024, 1024)
      sence.add(light)
    }

    function initSkybox() {
      const loader = new Three.CubeTextureLoader()
      const cubeTexture = loader.load([
        require('../../assets/img/night/posx.jpg'),
        require('../../assets/img/night/negx.jpg'),
        require('../../assets/img/night/posy.jpg'),
        require('../../assets/img/night/negy.jpg'),
        require('../../assets/img/night/posz.jpg'),
        require('../../assets/img/night/negz.jpg')
      ])
      sence.background = cubeTexture
      // sence.fog = new Three.Fog(new Three.Color(0xa0a0a0, 500, 2000))
    }

    function initRaycaster() {
      self.raycaster = new Three.Raycaster()
    }

    function initModel() {
      const loader = new GLTFLoader()
      loader.load(require("../../assets/gameSource/plane/microplane.glb"), gltf => {
        sence.add(gltf.scene)
        self.plane = gltf.scene
        // 螺旋桨
        self.propeller = self.plane.getObjectByName("propeller");
      })
    }

    function initEdgeAttr() {
      self.composer = new EffectComposer( renderer );
      const renderPass = new RenderPass( sence, camera );
      self.composer.addPass( renderPass );

      self.outlinePass = new OutlinePass( new Three.Vector2( window.innerWidth, window.innerHeight ), sence, camera );
      self.composer.addPass( self.outlinePass );

      // const outputPass = new OutputPass();
      // self.composer.addPass( outputPass );

      // self.effectFXAA = new ShaderPass( FXAAShader );
      // self.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      // self.composer.addPass( self.effectFXAA );
    }

    function addSelectedObject( object ) {

      self.selectedObjects = [];
      self.selectedObjects.push( object );

    }

    function checkIntersection() {

      self.raycaster.setFromCamera( self.mouse, camera );

      const intersects = self.raycaster.intersectObject( sence, true );
      if ( intersects.length > 0 ) {

        const selectedObject = intersects[ 0 ].object;
        addSelectedObject( selectedObject );
        self.outlinePass.selectedObjects = self.selectedObjects;

      } else {

        self.outlinePass.selectedObjects = [];

      }

    }

    function onPointerMove( event ) {

      if ( event.isPrimary === false ) return;

      self.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      self.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      checkIntersection();

    }

    function initEvent() {
      container.current.addEventListener('mousemove', onPointerMove)
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
      self.composer.render()
      window.requestAnimationFrame(refresh)
    }
  
    return <div>
      <div className={styles.header}>高亮边框选中demo</div>
      <div ref={container}></div>
    </div>
  }