
class PointSelector{
	constructor(canvas){
		this.canvas = canvas;
		this.lastPoint = [];
		this.currentPointList = [];
		this.pointListList = [];
		this.targetElement;
		this.controlButton;
		this.pointListActive = false;

		this.startPointList = ()=>{
			console.log(this.canvas)
			this.pointListActive = true;
			this.currentPointList = [];
			this.canvas.addEventListener("click", this.onClickFunc);
			this.targetElement.innerHTML = "current polygon: ";
		};
		this.endPointList = ()=>{
			this.pointListActive = false;
			this.pointListList.push([].concat(this.currentPointList));
			this.currentPointList = [];
			this.canvas.removeEventListener("click", this.onClickFunc);
		};

		this.onClickFunc = (e)=>{
			let point = [e.offsetX, e.offsetY];
			this.currentPointList.push(point);
			if(this.targetElement){
				console.log(this.targetElement)
				this.targetElement.innerHTML = `current polygon: ${JSONstringifyList(this.currentPointList)}`;
			}
		};

		this.controlButtonFunc = ()=>{
			if(this.pointListActive){
				this.endPointList();
				this.controlButton.innerHTML = "Start List";
			}else{
				this.startPointList();
				this.controlButton.innerHTML = "End List";
			}
		}

		//setters

		this.setControlButton = (button)=>{
			this.controlButton = controlButton;
			this.controlButton.addEventListener("click", this.controlButtonFunc);
		}

		this.setTargetElement = (target)=>{
			this.targetElement = target;
		}


	}
}

//helper functions

const JSONstringifyList = (list)=>{
	return list.reduce((accum, curr, index, arr)=>{
		if(index == arr.length-1){
			return accum + `["${curr[0]}", "${curr[1]}"]]`
		}else{
			return accum + `["${curr[0]}", "${curr[1]}"], `
		}
	}, '[')
}