const config = require('../config.json');
const Collisions = require(__dirname + '/collision_detection.js')
const {Vector2, addVectors} = require(__dirname + '/aydab_geometry.js')
//object literals for input handling
const speed = parseInt(config.playerSpeed); // set back to 7 when done testing stuff
const verticalMargin = - 2;
const moveFactor = .01;
const moveFuncs = {
		'up': (player, engine)=>{
			// console.log(player.position.y)
			let potentialPosition = new Vector2(player.position.x, player.position.y - speed * engine.getDeltaTime() * moveFactor) 
			
			doMove(player, engine, potentialPosition, new Vector2(0, player.size.y + verticalMargin));
		},
		'down': (player, engine)=>{
			let potentialPosition = new Vector2(player.position.x, player.position.y + speed * engine.getDeltaTime() * moveFactor);
			
			doMove(player, engine, potentialPosition, new Vector2(0, player.size.y + verticalMargin));
		},
		'left': (player, engine)=>{
			let potentialPosition = new Vector2(player.position.x - speed * engine.getDeltaTime() * moveFactor, player.position.y)

			doMove(player, engine, potentialPosition, new Vector2(0, player.size.y + verticalMargin));
		},
		'right': (player, engine)=>{
			let potentialPosition = new Vector2( player.position.x + speed * engine.getDeltaTime() * moveFactor, player.position.y)

			doMove(player, engine, potentialPosition, new Vector2(player.size.x, player.size.y + verticalMargin));
		}
}

//runs collision check and executes if the player is allowed to make that move
const doMove = (player, engine, potentialPosition, sizeDelta = new Vector2(0, 0))=>{
	if(checkCollision(addVectors(potentialPosition, sizeDelta), engine.roomLoader.getRoom(player.room))){
		player.position = potentialPosition;
	}
}

//checks if player can walk
const checkCollision = (potentialPosition, room)=>{
	
	let walkablePolygons = []

	let doWalk = false; //will return true if potentialPos is in any polygon

	for(let i in room.walkable){
		walkablePolygons.push(room.walkable[i].map((arr)=>{
			return arr.map(a=>parseInt(a))
		}))
	}

	for(let i in walkablePolygons){
		// console.log([walkablePolygons[i], potentialPosition])
		if(Collisions.pointInPolygon(vec2ToPoint(potentialPosition), walkablePolygons[i])){
			doWalk = true;
		}
	}
	return doWalk;
}

const vec2ToPoint = (v)=>{
	return [v.x, v.y]
}


const keyActions = {
		'w': moveFuncs.up,
		'a': moveFuncs.left,
		's': moveFuncs.down,
		'd': moveFuncs.right,
}

//main class
class CharController {
	constructor(player, engine, roomLoader){
		this.player = player;
		this.engine = engine;
		this.keysDown = {};

		this.setKeysDown = (keysDown)=>{
			this.keysDown = keysDown;
			// console.log(keysDown)
		}

		this.movePlayer = ()=>{

			for(let i in this.keysDown){
				for(let i in this.keysDown){
					if(this.keysDown[i] && keyActions.hasOwnProperty(i)){
						keyActions[i](this.player, this.engine);
					}
				}
			}
		}

		this.engine.addUpdateFunc(this.player.id, this.movePlayer);

		this.end = ()=>{
			this.engine.removeUpdateFunc(this.player.id)
		}
	}
}

module.exports = CharController;