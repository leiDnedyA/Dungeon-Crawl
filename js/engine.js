const config = require('../config.json');

const maxIdle = parseInt(config.maxIdleMinutes); //max time a player can idle before getting kicked (in minutes)

class Engine {
	constructor(frameRate, playerList){
		
		this.frameRate = frameRate;
		this.updateFuncs = {};
		this.deltaTime = 0;
		this.lastUpdate = Date.now();
		this.playerList = playerList;

		this.lastIdleCheck = Date.now();

		this.update = ()=>{
			// console.log('update')
			//STUFF FOR ENGINE

			//deltatime stuff
			let now = Date.now();
			this.deltaTime = now - this.lastUpdate;
			this.lastUpdate = now;

			//external updates
			for(let i in this.updateFuncs){
				if(typeof this.updateFuncs[i] === 'function'){
					this.updateFuncs[i](this);
				}else{
					console.log('ERROR: updateFuncs[i] not instanceof function VVV')
					console.log(this.updateFuncs[i])
				}
			}

			if(this.lastUpdate - this.lastIdleCheck >= 100){
				for(let i in playerList){
					if(playerList[i].getAFKTime() > maxIdle * 60000 && !playerList[i].afkExcempt){
						playerList[i].kick("idle");
					}
				}
			}


		}

		this.getDeltaTime = ()=>{
			return this.deltaTime;
		}

		this.start = ()=>{
			setInterval(this.update, 1000/this.frameRate);
			// console.log('engine running')
		}

		this.addUpdateFunc = (id, callback)=>{
			this.updateFuncs[id] = callback;
		}

		this.removeUpdateFunc = (id)=>{
			if(this.updateFuncs.hasOwnProperty(id)){
				delete this.updateFuncs[id];
			}
		}
	}
}

module.exports = Engine;