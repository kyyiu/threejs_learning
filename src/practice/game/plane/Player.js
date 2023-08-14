import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class Player {
  constructor(info) {
    this.game = info;
    this.scene = info.sence
    this.load()
    this.tmpPos = new Vector3()
  }

  get position() {
    if (this.plane !== undefined) {
      this.plane.getWorldPosition(this.tmpPos)
    }
    return this.tmpPos
  }

  set visible(mode) {
    this.plane.visible = mode
  }

  load() {
    const loader = new GLTFLoader()
    loader.load(require("../../../assets/gameSource/plane/microplane.glb"), gltf => {
      this.scene.add(gltf.scene)
      this.plane = gltf.scene
      // 螺旋桨
      this.propeller = this.plane.getObjectByName("propeller");
      this.velocity = new Vector3(0, 0 , 0.1)

    })
  }

  update(time) {
    if (!this.plane) {
      return
    }
    if (this.propeller !== undefined) {
      this.propeller.rotateZ(1)
    }
    if (this.game.active) {
      if (!this.game.spaceKey) {
        this.velocity.y -= 0.001
      } else {
        this.velocity.y += 0.001
      }
      this.velocity.z += 0.0001
      this.plane.rotation.set(0, 0, Math.sin(time * 3)*0.2, 'XYZ')
      this.plane.translateZ(this.velocity.z)
      this.plane.translateY(this.velocity.y)
    } else {
      this.plane.rotation.set(0, 0, Math.sin(time*3)*0.2, 'XYZ')
      this.plane.position.y = Math.cos(time) * 1.5
    }
  }
}

export { Player }