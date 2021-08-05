
class Engine {
	constructor(startFunc, frameRate = 15){
		this.frameRate = frameRate;
		this.startFunc = startFunc;
		this.updFuncList = [];

		this.updFunc = ()=>{
			for(let i in this.updFuncList){
				this.updFuncList[i]();
			}
		}

		this.addUpdFunc = (func)=>{
			this.updFuncList.push(func);
		}

		this.start = ()=>{
			this.startFunc();
			setInterval(this.updFunc, 1000/this.frameRate)
		}

		this.setRenderer = (r)=>{
			this.renderer = r;
			this.addUpdFunc(()=>{r.render([], [])});
		}

	}
}