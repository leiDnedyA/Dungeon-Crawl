
class EditorInterface {
	constructor(renderer){
		this.renderer = renderer;

		this.roomObj = null;

		this.gameObjects = {};


		this.loadRoom = (roomObj)=>{
			this.roomObj = roomObj;
			this.renderer.loadRoom(roomObj);
			this.gameObjects = {};
			this.gameObjects.walkable = new PolygonObject(gameObjectDefaults.walkable.name, roomObj.walkable.main, gameObjectDefaults.walkable.color);
			this.gameObjects.walkable.toggle()
		}
	}
}

class GameObject {
	constructor(name, position){
		this.name = name;
		this.position = position;
		this.enabled = true;
		this.toggle = ()=>{ //if disabled, GameObject will not render
			this.enabled = !this.enabled;
		}
	}
}

class AlphaColor {
	constructor(hex, alpha = 1){
		this.hex = hex;
		this.alpha = alpha;
	}
}

class PolygonObject extends GameObject {
	constructor(name, pointArray, color = new AlphaColor('#ff0000', .2)){
		super(name, null); //position is redundant for this purpose
		this.points = pointArray;
		this.color = color;
	}
}

const gameObjectDefaults = {
	walkable : {
		name : "walkable",
		color: new AlphaColor("#00ff00", .2)
	}
}