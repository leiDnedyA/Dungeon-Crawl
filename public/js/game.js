class Game{
	constructor(){
		this.fileManager = new FileManager();
		this.gameObjects = {};
		this.player;

		this.playerInit = (name, pos = new Vector2(0, 0))=>{
			this.player = new Player(name, pos)
			// this.gameObjects[this.player.id] = this.player;
		}

		this.getFileManager = ()=>{
			return this.fileManager;
		}
	}
}