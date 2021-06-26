const canvas = document.querySelector("#canvas");

const fileLoader = new FileLoader();
const engine = new Engine(()=>{
	canvInterface.start();
	engine.setRenderer(canvInterface);
	pointSelector.setControlButton(controlButton);
	pointSelector.setTargetElement(pointTargetElement);
});
const canvInterface = new CanvasInterface(canvas);
const pointSelector = new PointSelector(canvas);

//HTML ELEMENTS
//for uploading background
const uploadButton = document.querySelector("#uploadButton");
const uploadField = document.querySelector("#imageUpload")
//for making a list of points for polygons
const controlButton = document.querySelector("#pointButton");
const pointTargetElement = document.querySelector("#targetP")




uploadButton.addEventListener('click', ()=>{
	fileLoader.setSrcFromUpload(uploadField, canvInterface.background, ()=>{
		canvInterface.handleResize();
	});
	canvInterface.render();
})

engine.start();