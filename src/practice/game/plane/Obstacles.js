import { Vector3, Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Explosion } from './Explosion.js';
class Obstacles {
  constructor(game) {
    this.game = game
    this.sence = game.sence
    this.loadStart()
    this.loadBomb()
    this.tmpPos = new Vector3()
    this.explosions = [];
  }

  loadStart() {
    const loader = new GLTFLoader()
    loader.load(require("../../../assets/gameSource/plane/star.glb"), gltf => {
      this.star = gltf.scene.children[0]
      this.star.name = 'star'
      if (this.bomb !== undefined) {
        this.init()
      }
    })
  }

  loadBomb() {
    const loader = new GLTFLoader()
    loader.load(require("../../../assets/gameSource/plane/bomb.glb"), gltf => {
      this.bomb = gltf.scene.children[0];
      if (this.bomb !== undefined) {
        this.init()
      }
    })
  }

  init() {
    this.obstacles = []
    const obstacles = new Group()
    obstacles.add(this.star)
    this.bomb.rotation.x = -Math.PI * 0.5
    this.bomb.position.y = 7.5
    obstacles.add(this.bomb)
    let rotate = true
    for (let y = 7.5; y > -8; y -= 2.5) {
      rotate = !rotate
      if (y === 0) {
        continue
      }
      const bomb = this.bomb.clone()
      bomb.rotation.x = rotate ? -Math.PI * 0.5 : 0
      bomb.position.y = y
      obstacles.add(bomb)
    }
    this.obstacles.push(obstacles)
    this.sence.add(obstacles)

    for (let i = 0; i < 3; i++) {
      const obstaclesT = obstacles.clone()
      this.sence.add(obstaclesT)
      this.obstacles.push(obstaclesT)
    }

    this.reset()
  }

  reset() {
    this.obstacleSpawn = { pos: 20, offset: 5 };
    this.obstacles.forEach(obstacle => this.respawnObstacle(obstacle));
    let count;
        while( this.explosions.length>0 && count<100){
            this.explosions[0].onComplete();
            count++;
        }
  }

  removeExplosion( explosion ){
    const index = this.explosions.indexOf( explosion );
    if (index != -1) this.explosions.indexOf(index, 1);
}

  respawnObstacle(obstacle) {
    this.obstacleSpawn.pos += 30;
    const offset = (Math.random() * 2 - 1) * this.obstacleSpawn.offset;
    this.obstacleSpawn.offset += 0.2;
    obstacle.position.set(0, offset, this.obstacleSpawn.pos);
    obstacle.children[0].rotation.y = Math.random() * Math.PI * 2;
    obstacle.userData.hit = false;
    obstacle.children.forEach(child => {
      child.visible = true;
    });
  }

  update(pos) {
    let collisionObstacle;

    this.obstacles.forEach(obstacle => {
      obstacle.children[0].rotateY(0.01);
      const relativePosZ = obstacle.position.z - pos.z;
      if (Math.abs(relativePosZ) < 2 && !obstacle.userData.hit) {
        collisionObstacle = obstacle;
      }
      if (relativePosZ < -20) {
        this.respawnObstacle(obstacle);
      }
    });


    if (collisionObstacle !== undefined) {
      collisionObstacle.children.some(child => {
        child.getWorldPosition(this.tmpPos);
        const dist = this.tmpPos.distanceToSquared(pos);
        if (dist < 5) {
          collisionObstacle.userData.hit = true;
          this.hit(child);
          return true;
        }
      })

    }
  }

  hit(obj) {
    if (obj.name == 'star') {
      obj.visible = false;
      this.game.incScore();
    } else {
      this.explosions.push( new Explosion(obj, this) );
      this.game.decLives();
    }
  }
}

export { Obstacles }