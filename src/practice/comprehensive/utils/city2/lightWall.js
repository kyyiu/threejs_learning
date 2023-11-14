import * as THREE from 'three'
import gsap from 'gsap'

export default class LightWall {
  constructor() {
    this.geometry = new THREE.CylinderGeometry(5, 5, 2, 32, 1, true)
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
          gl_Position = projectionMatrix * viewPosition;
          vPosition = position;
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        uniform float uHeight;
        void main() {
          float gradMix = 1.0 - (vPosition.y + uHeight/2.0)/uHeight;
          gl_FragColor = vec4(1,1,0, gradMix);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(0, 1, 0)
    this.mesh.geometry.computeBoundingBox();
    //   console.log(mesh.geometry.boundingBox);
  
    let { min, max } = this.mesh.geometry.boundingBox;
    //   获取物体的高度差
    let uHeight = max.y - min.y;
    this.material.uniforms.uHeight = {
      value: uHeight
    }
    gsap.to(this.mesh.scale, {
      x: 0.5,
      z: 0.5,
      duration: 2,
      repeat: -1,
      yoyo: true
    })
  }
}