class Client{
	constructor(name, game){

		this.socket = io();
		this.id;

		this.player; // needs to be set in this.start() function
		this.game = game;
		this.nonPlayerEntities = {};

		this.socket.on('playerSetup', (data)=>{
			this.id = data.id;
			this.player.position = new Vector2(data.position[0], data.position[1]);
		})

		this.start = (player)=>{
			this.player = player;
			this.socket.on('entityData', this.handleData);
		}

		this.sendMoveData = (data)=>{
			this.socket.emit('moveRequest', data);
		}

		this.handleData = (data)=>{
			// console.log(data)
			for(let i in data){
				let pos = new Vector2(data[i].position[0], data[i].position[1]);
				if(this.game.gameObjects.hasOwnProperty(i)){
					this.game.gameObjects[i].position = pos;
				}else if(i == this.id){
					// console.log(data[i])
					this.player.position = pos;
				}else{
					let p = new Player('newGuy', pos);
					p.id = i;
					this.game.gameObjects[i] = p;
				}
			}
		}


	}

}