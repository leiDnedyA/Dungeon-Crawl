
class CanvasInterface {
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.background = new Image();

		this.offset = [0, 0];

		this.start = ()=>{
			this.canvas.style["border-style"] = "solid"
			window.addEventListener('resize', this.handleResize)
			this.handleResize();
		}

		this.render = (gameObjects, points)=>{
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx.drawImage(this.background, 0, 0);
		}

		this.handleResize = ()=>{
			let innerWidth = window.innerWidth/2;
				let innerHeight = window.innerHeight/2;

				this.backgroundScale = innerHeight /this.background.height;

				// console.log(`${heightRatio}, ${innerHeight}, ${innerWidth}`)

				if(innerWidth >= this.background.width * this.backgroundScale){
					this.canvas.width = this.background.width * this.backgroundScale;
				}else{
					this.canvas.width = innerWidth;
				}

				this.canvas.height = innerHeight;
		}

	}
}