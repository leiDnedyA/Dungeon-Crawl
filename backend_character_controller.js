//object literal for input handling
// const move = {
// 	moveFuncs : {
// 		'up': (player)=>{
// 			this.player.position.y -= speed * this.engine.getDeltaTime() * this.moveFactor;
// 		},
// 		'down': ()=>{
// 			this.player.position.y += speed * this.engine.getDeltaTime() * this.moveFactor;
// 		},
// 		'left': ()=>{
// 			this.player.position.x -= speed * this.engine.getDeltaTime() * this.moveFactor;
// 		},
// 		'right': ()=>{
// 			this.player.position.x += speed * this.engine.getDeltaTime() * this.moveFactor;
// 		}
// 	},
// 	keyActions : {
// 		'w': this.moveFuncs.up,
// 		'a': this.moveFuncs.left,
// 		's': this.moveFuncs.down,
// 		'd': this.moveFuncs.right,
// 	}
// }

//main class
class CharController {
	constructor(player){
		this.player = player;
		this.movePlayer = (keysDown)=>{

			console.log(keysDown);

			// for(let i in this.keysDown){
			// 	for(let i in this.keysDown){
			// 		if(this.keysDown[i]){
			// 			this.keyActions[i]();
			// 		}
			// 	}
			// }
		}
	}
}

module.exports = CharController;