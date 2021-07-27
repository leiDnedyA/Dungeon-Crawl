class Engine {
	constructor(startFunc, updFunc, canvas, framerate = 30){
		this.game = new Game();
		this.renderer = new Renderer(canvas);
		this.client = new Client('username', this.game, this);
		this.playerName = 'username';
		this.player = this.game.gameObjects[this.client.id]
		this.cameraController = new CameraController(this, this.renderer, this.player)
		this.chatHandler = new ChatHandler(this, this.client, document.querySelector("#chatInput"), document.querySelector("#chatButton"));
		this.updateFuncs = [];
		this.ended = false; //game loop will only run if this is false. 

		this.start = ()=>{
			startFunc(this);
			this.game.playerInit(this.playerName)
			this.game.player.setEngine(this);
			this.client.start(this.game.player, this.chatHandler);
			this.setPlayer(this.game.player);
			this.player.setClient(this.client);
			this.cameraController.start();
			this.chatHandler.start();
			this.addUpdFunc(()=>{
				this.renderer.render(this.game.gameObjects, this.chatHandler.liveMessages);
			});
			this.addUpdFunc(()=>{this.timeUpdate()})

			setInterval(this.update, 1000/framerate);
		};
		this.update = ()=>{
			if(!this.ended){
				updFunc(this);
				for(let i in this.updateFuncs){
					this.updateFuncs[i](this);
				}
			}
		};


		this.endSession = ()=>{

			this.renderer.endSession();
			this.ended = true;
		}
	}

	getGame(){
		return this.game;
	}

	addUpdFunc(func){
		this.updateFuncs.push(func);
	}

	getDeltaTime(){
		return this.deltaTime;
	}

	timeUpdate(){
		let now = Date.now();
		this.deltaTime = now - this.lastUpdate;
		this.lastUpdate = now;
	}

	setPlayerName(name){
		this.playerName = name;
	}

	setPlayer(player){
		this.player = player;
		this.cameraController.setPlayer(this.player);
	}

	getRenderer(){
		return this.renderer;
	}

	getClient(){
		return this.client;
	}

}