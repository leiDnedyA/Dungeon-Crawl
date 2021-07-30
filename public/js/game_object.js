const defaultSize = 50;

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

		this.sprite = new Image(this.size.x, this.size.y);
		this.sprite.src = "/img/entities/mushroom/mushroom_sprite_1.png";
		this.cellSize = new Vector2(64, 64)
		this.direction = 4; /* NOTE:
		
		direction is an int going from 0 to 7, which represents the rotation of the chatacter in 15 degree increments.
		Can be modeled in degrees by r = direction * 45 

		*/

		this.start = (game)=> {
			game.gameObjects[this.id] = this;
		}

		this.setEngine = (engine)=>{
			this.controller.init(engine);
		}

		this.setDirectionFromVelocity = (v)=>{ //changes entity direction based on velocity
			if(v.x == 0 && v.y == 0){
				return; //does nothing if the velocity is 0, 0
			} 
			if(v.x > 0){
				if(v.y < 0){
					this.direction = 1;
					return;
				}else if(v.y > 0){
					this.direction = 3;
					return;
				}
				else{
					this.direction = 2;
					return;
				}
			}else if(v.x < 0){
				if(v.y < 0){
					this.direction = 7;
					return;
				}else if(v.y > 0){
					this.direction = 5;
					return;
				}
				else{
					this.direction = 6;
					return;
				}
			}else{
				if(v.y > 0){
					this.direction = 4;
				}else{
					this.direction = 0;
				}
			}
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