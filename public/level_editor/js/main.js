
const fileLoader = new FileLoader();
const engine = new Engine(()=>{
	canvInterface.start();
	engine.setRenderer(canvInterface);
});
const canvInterface = new CanvasInterface(document.querySelector("#canvas"));

const uploadButton = document.querySelector("#uploadButton");
const uploadField = document.querySelector("#imageUpload")

uploadButton.addEventListener('click', ()=>{
	fileLoader.setSrcFromUpload(uploadField, canvInterface.background);
	canvInterface.render();
})

engine.start();