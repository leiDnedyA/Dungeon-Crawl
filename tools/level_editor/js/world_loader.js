
//loads in level json file
class WorldLoader {
	constructor(levelField, levelButton, fileLoader){
		this.levelField = levelField;
		this.levelButton = levelButton;
		this.fileLoader = fileLoader;

		this.levelOBJ = null; //where level data is stored

		this.start = ()=>{
			this.levelButton.addEventListener('click', ()=>{
				this.fileLoader.loadJSON(this.levelField, this.levelOBJ, (e)=>{
					this.levelOBJ = JSON.parse(e.target.result);
					console.log("Level loaded successfully");
					console.log(this.levelOBJ);
				})

			})
		}
	}
}