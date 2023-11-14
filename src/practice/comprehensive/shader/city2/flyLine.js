import * as THREE from 'three'
import gsap from 'gsap'

export default class FlyLineShader {
  constructor() {
    const points = [
      new THREE.Vector3(0,0,0),
      new THREE.Vector3(-5,4,0),
      new THREE.Vector3(-10,0,0),
    ]
    this.lineCurve = new THREE.CatmullRomCurve3(points)
    const lineCurvePoints = this. lineCurve.getPoints(1000)
    this.geometry = new THREE.BufferGeometry().setFromPoints(lineCurvePoints)
    
    // 给每个顶点设置属性
    const aSizeArray = new Float32Array(lineCurvePoints.length)
    for (let i = 0; i< aSizeArray.length; i++) {
      aSizeArray[i] = i
    }
    // 设置几何体顶点属性
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Color(0xffff00)
        },
        uLength: {
          value: aSizeArray.length
        }
      },
      vertexShader: `
        attribute float aSize;
        varying float vSize;
        uniform float uTime;
        uniform float uLength;
        uniform vec3 uColor;
        void main() {
          vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1);
          gl_Position = projectionMatrix * viewPosition;
          vSize = (aSize - uTime);
          if (vSize < 0.0) {
            vSize = vSize + uLength;
          }
          vSize = (vSize - 100.0)* 0.1;
          // gl_PointSize = vSize;
          // vSize上面为固定值，远离为负值，取反,效果为 远离细，靠近粗
          gl_PointSize = -(vSize/viewPosition.z);
        }
      `,
      fragmentShader: `
        varying float vSize;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5, 0.5));
          // 横截面处理为圆形
          float strength = 1.0 - (distanceToCenter * 2.0);
          if (vSize <= 0.0) {
            gl_FragColor = vec4(1, 0, 0, 0);
            return;
          }
          gl_FragColor = vec4(1, 0, 0, strength);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    this.mesh = new THREE.Points(this.geometry, this.shaderMaterial)
    gsap.to(this.shaderMaterial.uniforms.uTime, {
      value: 1000,
      duration: 3,
      repeat: -1,
      ease: 'none'
    })
  }
}