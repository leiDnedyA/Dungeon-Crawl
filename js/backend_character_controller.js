//object literals for input handling
const speed = 7; // set back to 7 when done testing stuff
const moveFactor = .01;
const moveFuncs = {
		'up': (player, engine)=>{
			// console.log(player.position.y)
			player.position.y -= speed * engine.getDeltaTime() * moveFactor;
		},
		'down': (player, engine)=>{
			player.position.y += speed * engine.getDeltaTime() * moveFactor;
		},
		'left': (player, engine)=>{
			player.position.x -= speed * engine.getDeltaTime() * moveFactor;
		},
		'right': (player, engine)=>{
			player.position.x += speed * engine.getDeltaTime() * moveFactor;
		}
}

const keyActions = {
		'w': moveFuncs.up,
		'a': moveFuncs.left,
		's': moveFuncs.down,
		'd': moveFuncs.right,
}

//main class
class CharController {
	constructor(player, engine){
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