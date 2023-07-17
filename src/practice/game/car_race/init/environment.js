import * as THREE from 'three'

let textureSky, textureGround, textureFinishLine, displaySigns, sence, curTime, texture, skyBackup
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
function createGround() {}
function createRoad() {}
function createGuardRails() {}
function createFinishLine() {}
function createSigns() {}

export default function initEnvironment(param) {
    param = param || {};
	sence = param.sence
	console.log("EA", param);
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
	
	createSky();
	createGround();
	createRoad();
	createGuardRails();
	createFinishLine();
	if (displaySigns)
	{
		createSigns();
	}

	curTime = Date.now();
}