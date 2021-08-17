const canvas = document.querySelector("#canvas");
const levelField = document.querySelector("#levelField");
const levelSubButton = document.querySelector("#levelSubmit")

const fileLoader = new FileLoader();
const engine = new Engine(()=>{
	canvInterface.start();
	worldLoader.start();
	engine.setWorldLoader(worldLoader);
	engine.setRenderer(canvInterface);
});

const canvInterface = new CanvasInterface(canvas);
const pointSelector = new PointSelector(canvas);
const worldLoader = new WorldLoader(levelField, levelSubButton, fileLoader, engine);


/* Use this later to load backgrounds
uploadButton.addEventListener('click', ()=>{
	fileLoader.setSrcFromUpload(uploadField, canvInterface.background, ()=>{
		canvInterface.handleResize();
	});
	canvInterface.render();
})
*/

window.worldLoader = worldLoader;
window.engine = engine;

engine.start();