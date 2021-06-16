class Renderer{
	constructor(canvas){
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');

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

			for(let i in gameObjects){
				this.drawObject(gameObjects[i]);
			}
		}

		this.drawObject = (gameObject)=>{
			// console.log('drawing')
			// console.log(gameObject);
			this.ctx.fillStyle = gameObject.color;
			this.ctx.fillRect(gameObject.position.x, gameObject.position.y, gameObject.size.x, gameObject.size.y);
		}

		this.handleResize = ()=>{
			// console.log('resize');
			this.canvas.width = window.innerWidth/2;
			this.canvas.height = window.innerHeight/2;
		}

	}

}