class Client{
	constructor(name, game){

		const socket = io();

		this.player; // needs to be set in this.start() function
		this.nonPlayerEntities = {};

		this.start = (player)=>{
			this.player = player;
		}

		this.sendMoveData = (data)=>{

		}

		this.handleData = (data)=>{

		}


	}

}