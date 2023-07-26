import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
let textureSky, 
textureGround, 
textureFinishLine, 
displaySigns, 
sence, 
curTime, 
texture, 
skyBackup,
groundBackup,
roadBackup,
leftrailBackup,
rightrailBackup,
finishsignBackup

const CAR_LENGTH = 4.2
const CAR_WIDTH = 1.8;
const DEFAULT_SPEED = 100 * 1000 / 3600;
const DEFAULT_SPEED_FACTOR = 2;
const CAR_HEIGHT = 1.2;

const RacingGame = {}
RacingGame.COLLIDE_RADIUS = Math.sqrt(2 * CAR_WIDTH);
RacingGame.STATE_LOADING = 0;
RacingGame.STATE_RUNNING = 1;
RacingGame.STATE_COMPLETE = 2;
RacingGame.STATE_CRASHED = 3;
RacingGame.CAR_Y = .4666;
RacingGame.CAR_START_Z = 10;
RacingGame.PLAYER_START_Z = 4;
RacingGame.best_time = Number.MAX_VALUE;

const Environment = {}
Environment.SKY_WIDTH = 3000;
Environment.SKY_HEIGHT = 200;
Environment.GROUND_Y = -10;
Environment.GROUND_WIDTH = 2000;
Environment.GROUND_LENGTH = 800;
Environment.ROAD_WIDTH = 8;
Environment.ROAD_LENGTH = 400;
Environment.RAIL_WIDTH = .2;
Environment.RAIL_LENGTH = Environment.ROAD_LENGTH;
Environment.ANIMATE_ROAD_FACTOR = 2;
Environment.FINISH_SIGN_WIDTH = 4.333;
Environment.FINISH_SIGN_HEIGHT = 1;
Environment.FINISH_SIGN_Y = 2.22;
Environment.NUM_SIGNS = 8;
Environment.SIGN_SCALE = .5;

function createSky() {
    if (textureSky)
    {
        const loader = new THREE.TextureLoader()
        texture = loader.load(require('../media/pics/clouds1273.jpg'))
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(1, 1);
    }
    else
    {
        texture = null;
    }
        
    const sky = new THREE.Mesh( new THREE.PlaneGeometry( Environment.SKY_WIDTH, 
        Environment.SKY_HEIGHT ), 
        new THREE.MeshBasicMaterial( 
        { color: textureSky ? 0xffffff : 0x3fafdd, map:texture } 
        ) 
    );
    sky.position.y = 100 + Environment.GROUND_Y;
    sky.position.z = -Environment.GROUND_LENGTH / 2;
    sence.add( sky );
    skyBackup = sky;
}
function createGround() {
    let texture = null;

	// Sand texture
	if (textureGround)
	{
        const loader = new THREE.TextureLoader()
		texture = loader.load(require("../media/pics/Sand_002.JPG"));
	    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	    texture.repeat.set(10, 10);
	}
	else
	{
		texture = null;
	}
	
	const ground = new THREE.Mesh( new THREE.PlaneGeometry( Environment.GROUND_WIDTH, 
			Environment.GROUND_LENGTH ), 
			new THREE.MeshBasicMaterial( 
			{ color: textureGround ? 0xffffff : 0xaaaaaa, ambient: 0x333333, map:texture } 
			)
	);
	ground.rotation.x = -Math.PI/2;
	ground.position.y = -.02 + Environment.GROUND_Y;
	sence.add( ground );
	groundBackup = ground;
}
function createRoad() {
    let texture = null;	

    // Road texture by Arenshi
    // http://www.turbosquid.com/Search/Artists/Arenshi
    // http://www.turbosquid.com/FullPreview/Index.cfm/ID/414729		
    texture = (new THREE.TextureLoader()).load(require("../media/pics/road-rotated.jpg"));
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40);

    const road = new THREE.Mesh( new THREE.PlaneGeometry( Environment.ROAD_WIDTH, 
            Environment.ROAD_LENGTH * 2),
            new THREE.MeshBasicMaterial( 
                    { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture } 
            ) 
    );
    road.rotation.x = -Math.PI/2;
    road.position.y = 0 + Environment.GROUND_Y;
    sence.add( road );
    roadBackup = road;
}
function createGuardRails() {
    let texture = null;	

	// Guard rail by scimdia
	// http://www.turbosquid.com/Search/Artists/scimdia
	// http://www.turbosquid.com/FullPreview/Index.cfm/ID/365705
	texture = (new THREE.TextureLoader()).load(require("../media/pics/Guard_Rail-rotated.jpg"))
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40);
	
	const leftrail = new THREE.Mesh( new THREE.PlaneGeometry( Environment.RAIL_WIDTH, 
        Environment.RAIL_LENGTH * 2), 
        new THREE.MeshBasicMaterial( 
        { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture } 
        )
	);
	leftrail.rotation.x = -Math.PI/2;
	leftrail.rotation.y = Math.PI/2;
	leftrail.position.x = -Environment.ROAD_WIDTH / 2;
	leftrail.position.y = .5 + Environment.GROUND_Y;
	
	sence.add( leftrail );
	leftrailBackup = leftrail;
	
	const rightrail = new THREE.Mesh( new THREE.PlaneGeometry( Environment.RAIL_WIDTH, 
        Environment.RAIL_LENGTH * 2), 
        new THREE.MeshBasicMaterial( 
        { color: 0xaaaaaa, shininess:100, ambient: 0x333333, map:texture } 
        )
	);
	rightrail.rotation.x = -Math.PI/2;
	rightrail.rotation.y = -Math.PI/2;
	rightrail.position.x = Environment.ROAD_WIDTH / 2;
	rightrail.position.y = .5 + Environment.GROUND_Y;
	
    sence.add( rightrail );
	rightrailBackup = rightrail;
}
function createFinishLine() {
    let texture = null;	

	if (textureFinishLine)
	{
		texture = (new THREE.TextureLoader()).load(require("../media/pics/game-finish-line.png"))
	}
	else
	{
		texture = null;
	}
		
	const finishsign = new THREE.Mesh( new THREE.PlaneGeometry( Environment.FINISH_SIGN_WIDTH, 
        Environment.FINISH_SIGN_HEIGHT ), 
        new THREE.MeshBasicMaterial( 
        { color: textureFinishLine ? 0xFFFFFF : 0xaaaaaa, 
                shininess:100, ambient: 0x333333, map:texture } 
        )
	);
	finishsign.position.z = -Environment.ROAD_LENGTH / 2 - CAR_LENGTH * 2;
	finishsign.position.y = Environment.FINISH_SIGN_Y + Environment.GROUND_Y;
	
	sence.add( finishsign );
	finishsignBackup = finishsign;
}
function createSigns() {
    // const url = require('/models/Route66obj/RT66sign.js')
    // console.log("XXX", url)
    const group = new THREE.Object3D;
	const loadCallback =  function(model) { onSignLoaded(model); }

	let scale = 0.7;
	
	scale = new THREE.Vector3(scale, scale, scale);
	const mtlLoader = new MTLLoader()
    mtlLoader.load(
        require('../media/model/Nissan GTR OBJ/Objects/NissanOBJ1.mtl'),
        (materials) => {
            materials.preload()
    
            const objLoader = new OBJLoader()
            objLoader.setMaterials(materials)
            objLoader.load(
                require('../media/model/Nissan GTR OBJ/Objects/NissanOBJ1.obj'),
                (mesh) => {
                    mesh.scale.copy(scale);
                    mesh.doubleSided = true;
                    // player
                    mesh.position.set(0, RacingGame.CAR_Y + Environment.GROUND_Y, 
                        -(Environment.ROAD_LENGTH / 2 - RacingGame.PLAYER_START_Z));
                    // enemy
                    // mesh.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
                    // mesh.scale.set(options.scale, options.scale, options.scale);
                    // mesh.position.set(options.position.x, options.position.y, options.position.z);
                    // var randx = (Math.random() -.5 ) * (Environment.ROAD_WIDTH - CAR_WIDTH);		
                    // var randz = (Math.random()) * Environment.ROAD_LENGTH / 2 - RacingGame.CAR_START_Z;
		
                    // mesh.position.set(randx+5, RacingGame.CAR_Y + Environment.GROUND_Y, -randz)
                    // mesh.rotation.set(-Math.PI / 2, 0, 0)
                    sence.add(mesh)

                    mesh = mesh;

                    loadCallback({mesh});
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log('An error happened', error)
                }
            )
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log('An error happened')
        }
    )
    // Tell the framework about our object
    sence.add(group);
}

function onSignLoaded(model) {
	for (var i = 0; i < Environment.NUM_SIGNS; i++)
	{
		var group = new THREE.Object3D;
		group.position.set(5.1, Environment.GROUND_Y, (-Environment.ROAD_LENGTH / 2) + (i * Environment.ROAD_LENGTH / Environment.NUM_SIGNS));
		var mesh = new THREE.Mesh(model.mesh.geometry, model.mesh.material);
		group.scale.set(Environment.SIGN_SCALE, Environment.SIGN_SCALE, Environment.SIGN_SCALE);
		group.add(mesh);
		sence.add(group);

		var group = new THREE.Object3D;
		group.position.set(-5.1, Environment.GROUND_Y, (-Environment.ROAD_LENGTH / 2) + (i * Environment.ROAD_LENGTH / Environment.NUM_SIGNS));
		var mesh = new THREE.Mesh(model.mesh.geometry, model.mesh.material);
		group.scale.set(Environment.SIGN_SCALE, Environment.SIGN_SCALE, Environment.SIGN_SCALE);
		group.add(mesh);
		sence.add(group);
	}
}

export default function initEnvironment(param) {
    param = param || {};
	sence = param.sence
	textureSky = param.textureSky;
	textureGround = param.textureGround;
	textureFinishLine = param.textureFinishLine;
	displaySigns = param.displaySigns;
	
    // Create a headlight to show off the model
	const headlight = new THREE.DirectionalLight( 0xffffff, 1);
	headlight.position.set(0, 0, 1);
	sence.add(headlight);

	const toplight = new THREE.DirectionalLight( 0xffffff, 1);
	toplight.position.set(0, 1, 0);
	sence.add(toplight);	
	
    const ambient = new THREE.AmbientLight( 0xffffff, 1);
	sence.add(ambient);
	
	// createSky();
	// createGround();
	// createRoad();
	// createGuardRails();
	// createFinishLine();
	if (displaySigns)
	{
		createSigns();
	}

	curTime = Date.now();
}