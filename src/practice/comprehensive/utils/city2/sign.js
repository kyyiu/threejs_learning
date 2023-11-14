import * as THREE from 'three'

export default class Sign {
  constructor(camera) {
    this.camera = camera
    const loader = new THREE.TextureLoader()
    const map = loader.load(require('../../../../assets/img/react_logo.png'))
    this.material = new THREE.SpriteMaterial({map})
    this.mesh = new THREE.Sprite(this.material)
    this.mesh.position.set(-4.2, 3.5, -1)
    
    this.fns = {
      onClick: []
    }

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    window.addEventListener('click', (e) => {
      this.mouse.x = (e.clientX/window.innerWidth)*2-1 // -1~1
      this.mouse.y = -((e.clientY/window.innerHeight)*2-1) 
      this.raycaster.setFromCamera(this.mouse, this.camera)
      const intersects = this.raycaster.intersectObject(this.mesh)
      if (!intersects.length) {
        return
      }
      this.fns.onClick.forEach(fn => {
        fn(e)
      })
    })
  }
  onClick(fn) {
    this.fns['onClick'].push(fn)
  }
}