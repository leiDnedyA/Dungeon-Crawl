
class EditorInterface {
	constructor(renderer){
		this.renderer = renderer;

		this.roomObj = null;

		this.gameObjects = {};


		this.loadRoom = (roomObj)=>{
			this.roomObj = roomObj;
			this.renderer.loadRoom(roomObj);
			this.gameObjects = {};
			//makes a polygon for walkable area
			this.gameObjects.walkable = new PolygonObject(gameObjectDefaults.walkable.name, roomObj.walkable.main, gameObjectDefaults.walkable.color);
			//loads all doors as polygons

			this.gameObjects.doors = [];

			for(let i in this.roomObj.doors){
				let door = this.roomObj.doors[i];
				let doorOBJ = new PolygonObject(`door ${i}`, door.box, gameObjectDefaults.door.color);
				// doorOBJ.toggle()
				this.gameObjects.doors.push(doorOBJ);
			}

			// this.gameObjects.walkable.toggle()
		}
	}
}

class GameObject {
	constructor(name, color, position, size){
		this.name = name;
		this.position = position;
		this.size = size;
		this.color = color;
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
		super(name, color, null, null); //position is redundant for this purpose
		this.points = pointArray;
	}
}

const gameObjectDefaults = {
	walkable : {
		name : "walkable",
		color: new AlphaColor("#00ff00", .2)
	},
	door : {
		color: new AlphaColor("#ff0000", .2)
	}
}