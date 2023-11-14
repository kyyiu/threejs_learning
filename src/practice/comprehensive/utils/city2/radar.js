import * as THREE from 'three'
import gsap from 'gsap'

export default class Radar {
  constructor() {
    this.geometry = new THREE.PlaneGeometry(4,4)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: {
          value: new THREE.Color('#00ff00')
        },
        uTime: {
          value: 0
        }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
          gl_Position = projectionMatrix * viewPosition;
          vPosition = position;
          vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform vec3 uColor;
        uniform float uTime;

        mat2 rotated2d(float _angle) {
          return mat2(cos(_angle), -sin(_angle),
                      sin(_angle), cos(_angle));
        }

        void main() {
          // 0.5里面是0，外面是1， 1减去后里面就是1
          float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
          // 雷达线
          vec2 newUv = rotated2d(uTime*6.28) * (vUv - 0.5);
          newUv+=0.5;
          float angle = atan(newUv.x - 0.5, newUv.y-0.5);
          float strength = (angle+3.14)/6.18;
          gl_FragColor = vec4(uColor, alpha * strength);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(-10.8, 0.5, 4)
    this.mesh.rotation.x = -Math.PI/2;

    gsap.to(this.material.uniforms.uTime, {
      value: 1,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
  }
}