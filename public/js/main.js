
const usernameField = document.querySelector('#nameInput');
const startButton = document.querySelector('#startButton');


const startFunc = (eng)=>{
	// console.log('started');
	engine.renderer.start();
	engine.client.emitStart(usernameField.value);
	engine.setPlayerName(usernameField.value);
	console.log(engine.playerName);
}
const updFunc = (eng)=>{
	// console.log('update');
}

const engine = new Engine(startFunc, updFunc, document.querySelector('#gameCanvas'));

window.engine = engine;

startButton.addEventListener('click', ()=>{
	engine.start();
	startButton.disabled = true;
})