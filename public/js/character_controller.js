class CharacterController{
	constructor(player, speed = 6){
		this.player = player;
		this.speed = speed;

		this.moveFactor = .01;

		this.engine;

		this.moveFuncs = {
			'up': ()=>{
				this.player.position.y -= speed * this.engine.getDeltaTime() * this.moveFactor;
			},
			'down': ()=>{
				this.player.position.y += speed * this.engine.getDeltaTime() * this.moveFactor;
			},
			'left': ()=>{
				this.player.position.x -= speed * this.engine.getDeltaTime() * this.moveFactor;
			},
			'right': ()=>{
				this.player.position.x += speed * this.engine.getDeltaTime() * this.moveFactor;
			}
		}

		this.keyActions = {
			'w': this.moveFuncs.up,
			'a': this.moveFuncs.left,
			's': this.moveFuncs.down,
			'd': this.moveFuncs.right,
		}
		this.keysDown = {
			
		}

		this.handleKeyDown = (e)=>{
			if(this.keyActions.hasOwnProperty(e.key)){
				this.keysDown[e.key] = true;
			}
		}
		this.handleKeyUp = (e)=>{
			if(this.keyActions.hasOwnProperty(e.key)){
				this.keysDown[e.key] = false;
			}
		}
	

		//eventually this will get scrapped for server movement
		this.movePlayer = ()=>{
			// for(let i in this.keysDown){
			// 	for(let i in this.keysDown){
			// 		if(this.keysDown[i]){
			// 			this.keyActions[i]();
			// 		}
			// 	}
			// }

			this.engine.client.sendMoveData(this.keysDown)

		}

		this.init = (engine)=>{
			this.engine = engine;
			this.engine.addUpdFunc(this.movePlayer);

			window.addEventListener('keydown', this.handleKeyDown);
			window.addEventListener('keyup', this.handleKeyUp);
		}

	}
}