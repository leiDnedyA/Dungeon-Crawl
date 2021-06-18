class Renderer{
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.background = new Image(this.canvas.width, this.canvas.height);
		this.playerOffset = new Vector2(0, 0)

		this.backgroundScale = new Vector2(1, 1)

		this.start = ()=>{
			this.handleResize();
			this.canvas.style.border = '1px solid black'
			window.addEventListener('resize', this.handleResize);
		}

		this.clearScreen = ()=>{
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		this.render = (gameObjects)=>{
			
			this.clearScreen();

			this.ctx.fillStyle = 'black';

			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.ctx.drawImage(this.background, 0 - this.playerOffset.x, 0 - this.playerOffset.y);

			for(let i in gameObjects){
				this.drawObject(gameObjects[i]);
			}
		}

		this.drawObject = (gameObject)=>{
			// console.log('drawing')
			// console.log(gameObject);
			this.ctx.fillStyle = gameObject.color;
			let newPos = new Vector2(gameObject.position.x - this.playerOffset.x, gameObject.position.y - this.playerOffset.y)
			this.ctx.fillRect(newPos.x, newPos.y, gameObject.size.x, gameObject.size.y);
			if(gameObject instanceof Player){
				this.ctx.font = "15px Georgia";
				let name = gameObject.name;
				this.ctx.fillText(name, newPos.x - (this.ctx.measureText(name).width/2)+gameObject.size.x / 2, newPos.y - 15);
			}
		}

		this.setBackground = (src)=>{
			this.background.src = src;
		}

		this.handleResize = ()=>{
			// console.log('resize');
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

		this.getBackgroundSize = ()=>{
			return {
				scale : this.backgroundScale,
				background: {
					width : this.background.width,
					height : this.background.height
				},
				canvas: {
					width: this.canvas.width,
					height: this.canvas.height
				}
			}
		}

	}

}