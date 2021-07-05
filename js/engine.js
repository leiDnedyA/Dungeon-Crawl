
class Engine {
	constructor(frameRate){
		
		this.frameRate = frameRate;
		this.updateFuncs = {};
		this.deltaTime = 0;
		this.lastUpdate = Date.now();

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