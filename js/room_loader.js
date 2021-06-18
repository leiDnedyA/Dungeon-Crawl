

class RoomLoader {
	constructor(world){
		this.world = world;
		this.startRoom = world.startRoom; //change this at some point
		console.log(this.world);

		this.getStart = ()=>{
			return this.startRoom;
		}

		this.getRoom = (roomName)=>{
			if(this.world.rooms.hasOwnProperty(roomName)){
				return this.world.rooms[roomName];
			}else{
				console.log(`ERROR LOADING ROOM: No room exists at the key "${roomName}"`)
				return null;
			}
		}
	}
}

module.exports = RoomLoader;