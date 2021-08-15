
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