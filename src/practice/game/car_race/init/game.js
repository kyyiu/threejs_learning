import initEnvironment from "./environment";

let paramSave, state, sounds, curTime, deltat, running, camera, sence
const CAR_WIDTH = 1.8;
const DEFAULT_SPEED = 100 * 1000 / 3600;
const DEFAULT_SPEED_FACTOR = 2;
const CAR_LENGTH = 4.2; // Supposedly, average car length
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

function createEnvironment() {
    initEnvironment({
        sence,
        textureSky:true,
        textureGround:true,
        textureFinishLine:true,
        displaySigns:true
    })
}

export default function initGame(param) {
	param = param || paramSave  || {};
	paramSave = param;
    sence = param.sence
    camera = param.camera
	sounds = param.sounds;
	
	createEnvironment();
	// loadCars();
	// loadRacer();
	
	curTime = Date.now();
	deltat = 0;
	
	running = false;
	state = RacingGame.STATE_LOADING;	

	// Make sure the game has keyboard focus
	// this.focus();

	// this.addContextListener();
}