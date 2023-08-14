import React, { useEffect } from "react";
import * as Three from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const geometry = new Three.SphereGeometry(5, 32, 32)
const pic = require("./hdr/h.hdr")
// const pic = require("../../assets/gameSource/hdr/venice_sunset_1k.hdr")
const texture = new RGBELoader().load(pic, (t) => {
  const m = new Three.MeshBasicMaterial({map: t})
  const sp = new Three.Mesh(geometry, m);
  sp.geometry.scale(1, 1, -1);
  scene.add(sp)
})

const renderer = new Three.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

export default function() {

  useEffect(() => {
    const dom = document.querySelector(".canvas");
    const controls = new OrbitControls(camera, dom);
    controls.enableDamping = true;
    dom.appendChild(renderer.domElement);
    animation();
  }, []);

  const animation = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(animation);
  }

  return <div className="canvas"></div>
}