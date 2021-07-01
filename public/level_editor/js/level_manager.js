
class LevelManager {
	constructor(name, fileLoader){
		
		this.name = name;
		this.level = new Level(name);
		this.fileLoader = fileLoader;

		this.addRoom = (room)=>{
			this.level.rooms[room.name] = room;
		}

		this.setStartRoom = (room)=>{
			this.level.startRoom = room.name;
		}

		this.setName = (newName)=>{
			this.name = newName;
		}
	}
}