
class Room {
	constructor(name, walkablePolygon, background, startPos = [0, 0], doors = []){
		this.name = name;
		this.walkable = {
			main : walkablePolygon
		};
		this.id = String(Math.random());
		this.startPos = startPos;
		this.doors = doors;
		this.background = background;


	}
}

class Level {
	constructor(name, rooms = [], startRoom = ""){
		this.name = name;
		this.startRoom = startRoom;
		this.rooms = {};
		for(let i in rooms){
			this.rooms[rooms[i].name] = rooms[i];
		}

	}
}

//will be completed later
class Door {

}