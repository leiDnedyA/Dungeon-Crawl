
//I really should have just called this renderer.js holy shit

const defBGSRC = "/res/default.png"

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

		this.render = (gameObjects)=>{
			this.ctx.fillStyle = "#ffffff"
			this.ctx.globalAlpha = 1;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx.drawImage(this.background, 0, 0);
			this.renderObjects(gameObjects);
		}

		this.renderObjects = (gameObjects)=>{
			for(let i in gameObjects){
				if(Array.isArray(gameObjects[i])){
					this.renderObjects(gameObjects[i])
				}else{
					if(gameObjects[i].enabled){
						if(gameObjects[i] instanceof PolygonObject){
							this.drawShape(gameObjects[i]);
						}
					}
				}
			}
		}

		this.drawShape = (gameObject)=>{
			let points = gameObject.points;
			this.ctx.fillStyle = gameObject.color.hex;
			this.ctx.globalAlpha = gameObject.color.alpha;
			this.ctx.beginPath();
			this.ctx.moveTo(...gameObject.points[0]);
			for(let i = 1; i < gameObject.points.length; i++){
				this.ctx.lineTo(...gameObject.points[i]);
			}
			this.ctx.closePath()
			this.ctx.fill();
		}

		this.drawRect = (gameObject)=>{
			// console.log(gameObject)
			this.ctx.fillStyle = gameObject.color.hex;
			this.ctx.globalAlpha = gameObject.color.alpha;
			this.ctx.fillRect(gameObject.position[0], gameObject.position[1], gameObject.size[0], gameObject.size[1]);
		}

		this.loadRoom = (roomOBJ)=>{
			this.setBackground(roomOBJ.background)

		}

		this.setBackground = (src)=>{
			this.background.src = src;

			setTimeout(()=>{
				this.handleResize();
			}, 200)
		}

		this.handleResize = ()=>{
			let innerWidth = window.innerWidth/2;
			let innerHeight = window.innerHeight/2;

			// console.log(`${heightRatio}, ${innerHeight}, ${innerWidth}`)

			if(this.background.src == ""){
				this.canvas.width = innerWidth;
				this.canvas.height = innerHeight;
			}else{
				this.canvas.width = this.background.width;

				this.canvas.height = this.background.height;
			}
		}

	}
}
