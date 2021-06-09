class Client{
	constructor(name, game){

		this.socket = io();

		this.player; // needs to be set in this.start() function
		this.nonPlayerEntities = {};

		this.start = (player)=>{
			this.player = player;
		}

		this.sendMoveData = (data)=>{
			console.log(data)
			this.socket.emit('moveRequest', data);
		}

		this.handleData = (data)=>{

		}


	}

}