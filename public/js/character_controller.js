class CharacterController{
	constructor(player, speed = 6){
		this.player = player;
		this.speed = speed;

		
		this.keyActions = {
				'w': true,
				'a': true,
				's': true,
				'd': true,
			}

		this.specialKeys = {
			'Space' : ()=>{
				this.player.client.socket.emit('doorRequest', {});
				// console.log(this.player)
			}
		}

		this.moveFactor = .01;

		this.engine;

		this.keysDown = {

		}

		this.handleKeyDown = (e)=>{
			if(this.keyActions.hasOwnProperty(e.key)){
				this.keysDown[e.key] = true;
			}
			if(this.specialKeys.hasOwnProperty(e.code)){
				this.specialKeys[e.code]();
			}
		}
		this.handleKeyUp = (e)=>{
			if(this.keyActions.hasOwnProperty(e.key)){
				this.keysDown[e.key] = false;
			}
		}
	

		//eventually this will get scrapped for server movement
		this.movePlayer = ()=>{

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