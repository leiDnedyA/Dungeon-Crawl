
const usernameField = document.querySelector('#nameInput');
const startButton = document.querySelector('#startButton');
const gameCanvas = document.querySelector('#gameCanvas');

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

const engine = new Engine(startFunc, updFunc, gameCanvas);

window.engine = engine;

document.addEventListener('click', (e)=>{ //checks if player has canvas selected
	engine.handleGlobalClick(e.target); 
})

window.addEventListener('keydown', function(e) { //prevents unwanted scrolling
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

startButton.addEventListener('click', ()=>{
	engine.start();
	startButton.disabled = true;
})

