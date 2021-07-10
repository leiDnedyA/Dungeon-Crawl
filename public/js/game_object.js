const defaultSize = 40;

class GameObject {
	constructor(position, size){
		this.position = position;
		this.size = size;
		this.id = Math.random().toString();
	}
}

class Entity extends GameObject{
	constructor(name, position, size){
		super(position, size);
		this.name = name;
		this.color = 'black';
	}
}

class Player extends Entity{
	constructor(name, position = new Vector2(0, 0), size = new Vector2(defaultSize, defaultSize), speed = 6){
		super(name, position, size);
		this.controller = new CharacterController(this, speed);

		this.start = (game)=> {
			game.gameObjects[this.id] = this;
		}

		this.setEngine = (engine)=>{
			this.controller.init(engine);
		}

		this.setClient = (client)=>{
			this.client = client;
		}
	}
}

class NPC extends GameObject{
	constructor(name, position, size = new Vector2(defaultSize, defaultSize)){
		super(name, position, size);
	}

	dialogue(){

	}

	nextMove(){

	}

}