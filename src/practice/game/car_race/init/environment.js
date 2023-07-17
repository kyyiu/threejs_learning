import * as THREE from 'three'

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
rightrailBackup

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
function createFinishLine() {}
function createSigns() {}

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