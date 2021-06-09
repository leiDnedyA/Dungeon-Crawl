
const startFunc = (eng)=>{
	// console.log('started');
	engine.renderer.start();
}
const updFunc = (eng)=>{
	// console.log('update');
}

const engine = new Engine(startFunc, updFunc, document.querySelector('#gameCanvas'));

engine.start();