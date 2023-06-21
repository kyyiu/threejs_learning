import React, { useEffect } from "react";
import * as Three from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const geometry = new Three.BoxGeometry(10, 10, 10);
// const material = new Three.MeshBasicMaterial({color: 0xffffff});
// const cube = new Three.Mesh(geometry, material);
// scene.add(cube)
const imgs = [
  require(`./multiple_imgs/room1/home.right.jpg`), 
  require(`./multiple_imgs/room1/home.left.jpg`), 
  require(`./multiple_imgs/room1/home.top.jpg`), 
  require(`./multiple_imgs/room1/home.bottom.jpg`), 
  require(`./multiple_imgs/room1/home.front.jpg`), 
  require(`./multiple_imgs/room1/home.back.jpg`)
];
const cubeMaterials = [];
imgs.forEach(e => {
  const texture = new Three.TextureLoader().load(e)
  cubeMaterials.push(new Three.MeshBasicMaterial({
    map: texture
  }))
})
const skyBox = new Three.Mesh(geometry, cubeMaterials)
skyBox.geometry.scale(1, 1, -1)
scene.add(skyBox);

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