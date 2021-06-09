class Engine {
	constructor(startFunc, updFunc, canvas, framerate = 30){
		this.game = new Game();
		this.renderer = new Renderer(canvas);
		this.client = new Client('username', this.game);

		this.updateFuncs = [];

		this.start = ()=>{
			startFunc(this);
			this.game.playerInit('aydab')
			this.game.player.setEngine(this);
			this.client.start(this.game.player);

			this.addUpdFunc(()=>{
				this.renderer.render(this.game.gameObjects);
			});
			this.addUpdFunc(()=>{this.timeUpdate()})

			setInterval(this.update, 1000/framerate);
		};
		this.update = ()=>{
			updFunc(this);
			for(let i in this.updateFuncs){
				this.updateFuncs[i](this);
			}
		};
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

	getRenderer(){
		return this.renderer;
	}

	getClient(){
		return this.client;
	}

}