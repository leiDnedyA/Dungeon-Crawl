class Client{
	constructor(name, game, engine){

		this.socket = io();
		this.id;

		this.player; // needs to be set in this.start() function
		this.chatHandler; //see above
		this.game = game;
		this.engine = engine;
		this.nonPlayerEntities = {};

		this.socket.on('playerSetup', (data)=>{
			this.id = data.player.id;
			console.log(data.name)

			for(let i in data.entities){
				this.addPlayer(data.entities[i])
			}

			this.player = this.game.gameObjects[this.id];

			this.engine.setPlayer(this.player);

		})

		this.socket.on('chat', (data)=>{
			let message = data.message;
			let id = data.id;
			console.log(`[CHAT] ${this.game.gameObjects[id].name} : '${message}'`)
			if(this.chatHandler){
				this.chatHandler.newMessage(message, id);
			}
		})


		this.socket.on('playerLeftRoom', (data)=>{
			this.deletePlayer(data);
			// console.log(data);
		})


		this.socket.on('playerJoinedRoom', (data)=>{
			this.addPlayer(data)
		})

		this.socket.on('roomChange', (data)=>{
			this.roomChange(data);
		});

		this.emitStart = (name)=>{
			this.socket.emit('start', {name : name});
		}

		this.start = (player, chatHandler)=>{
			this.player = player;
			this.chatHandler = chatHandler;
			this.socket.on('entityData', this.handleData);
			this.socket.on('playerConnect', this.addPlayer);
			this.socket.on('playerDisconnect', this.deletePlayer);
		}

		this.sendMoveData = (data)=>{
			this.socket.emit('moveRequest', data);
		}

		this.addPlayer = (data)=>{
			// console.log(data.name)
			if(!this.game.gameObjects.hasOwnProperty(data.id)){
				let p = new Player(data.name, data.position);
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

		this.roomChange = (data)=>{
			// console.log(data);
			this.engine.renderer.loadRoom(data.background);

			this.game.gameObjects = [];

			// console.log(data.entities);
			// console.log(this.gameObjects);

			for(let i in data.entities){
				this.addPlayer(data.entities[i])
			}

			this.player = this.game.gameObjects[this.id];

			this.engine.setPlayer(this.player);

		}


		//chat stuff
		this.sendChat = (message)=>{
			this.socket.emit('chat', {
				message : message
			})
		}

	}

}