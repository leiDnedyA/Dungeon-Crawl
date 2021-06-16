class Client{
	constructor(name, game){

		this.socket = io();
		this.id;

		this.player; // needs to be set in this.start() function
		this.game = game;
		this.nonPlayerEntities = {};

		this.socket.on('playerSetup', (data)=>{
			this.id = data.player.id;
			this.player.position = new Vector2(data.player.position[0], data.player.position[1]);
			console.log(data)

			for(let i in data.entities){
				this.addPlayer(data.entities[i])
			}

		})

		this.start = (player)=>{
			this.player = player;
			this.socket.on('entityData', this.handleData);
			this.socket.on('playerConnect', this.addPlayer);
			this.socket.on('playerDisconnect', this.deletePlayer);
		}

		this.sendMoveData = (data)=>{
			this.socket.emit('moveRequest', data);
		}

		this.addPlayer = (data)=>{
			if(!this.game.gameObjects.hasOwnProperty(data.id)){
				let p = new Player('newGuy', data.position);
				p.id = data.id;
				this.game.gameObjects[data.id] = p;
			}
		}

		this.deletePlayer = (data)=>{
			if(this.game.gameObjects.hasOwnProperty(data.id)){
				delete this.game.gameObjects[data.id];
			}
		}

		this.handleData = (data)=>{
			// console.log(data)
			for(let i in data){
				let position = new Vector2(data[i].position[0], data[i].position[1]);
				if(this.game.gameObjects.hasOwnProperty(i)){
					this.game.gameObjects[i].position = position;
				}else if(i == this.id){
					// console.log(data[i])
					this.player.position = position;
				}
			}
		}


	}

}