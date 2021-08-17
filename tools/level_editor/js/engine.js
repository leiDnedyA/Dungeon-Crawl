
class Engine {
	constructor(startFunc, frameRate = 15){
		this.frameRate = frameRate;
		this.startFunc = startFunc;
		this.updFuncList = [];

		this.worldLoader, this.renderer = null;

		this.editorInterface = null; //set on init

		this.updFunc = ()=>{
			for(let i in this.updFuncList){
				this.updFuncList[i]();
			}
		}

		this.addUpdFunc = (func)=>{
			this.updFuncList.push(func);
		}

		this.start = ()=>{ //also init
			this.startFunc();
			this.editorInterface = new EditorInterface(this.renderer)
			setInterval(this.updFunc, 1000/this.frameRate)
		}

		this.setRenderer = (r)=>{
			this.renderer = r;
			this.addUpdFunc(()=>{r.render(this.editorInterface.gameObjects)});
		}

		this.setWorldLoader = (w)=>{
			this.worldLoader = w;
		}

	}
}