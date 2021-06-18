
class CameraController {
	constructor(engine, renderer, player){
		this.engine = engine;
		this.renderer = renderer;
		this.player = player;
		this.backgroundInfo;
		this.lastPlayerPos;

		this.maxOffset = 40;

		this.playerSize = 40;

		//function to update camera offset

		this.start = ()=>{
			// window.addEventListener('resize', this.newBackground);
			this.engine.addUpdFunc(this.updateCamera);
		}

		this.updateCamera = ()=>{
			this.newBackground();
			let currentOffset = this.renderer.playerOffset;
			if(this.player){
				if(this.player.position != this.lastPlayerPos){
					// console.log(this.player.position)
					// console.log(`${this.backgroundInfo.scale} : scale`)
					// console.log([this.player.position, this.backgroundInfo.canvas])

					if((this.player.position.x - currentOffset.x) >= this.backgroundInfo.canvas.width - this.maxOffset - this.playerSize){
						this.renderer.playerOffset.x = this.player.position.x - this.backgroundInfo.canvas.width + this.maxOffset + this.playerSize;;
						// console.log(this.renderer.playerOffset)
					}
					if((this.player.position.x - currentOffset.x) <= this.maxOffset){
						this.renderer.playerOffset.x = this.player.position.x - this.maxOffset;
					}

					if((this.player.position.y - currentOffset.y) >= this.backgroundInfo.canvas.height - this.maxOffset - this.playerSize){
						this.renderer.playerOffset.y = this.player.position.y - this.backgroundInfo.canvas.height + this.maxOffset + this.playerSize;
						// console.log(this.renderer.playerOffset)
					}
					if((this.player.position.y - currentOffset.y) <= this.maxOffset){
						this.renderer.playerOffset.y = this.player.position.y - this.maxOffset;
					}


				}

				this.lastPlayerPos = this.player.position;
			}
		}



		this.setPlayer = (player)=>{
			this.player = player;
		}

		this.newBackground = ()=>{ //has to get called every time a new room is loaded			
			this.backgroundInfo = this.renderer.getBackgroundSize();
		} 

		this.newBackground();

	}
}