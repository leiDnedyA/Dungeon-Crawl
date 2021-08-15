
//loads in level json file
class WorldLoader {
	constructor(levelField, levelButton, fileLoader, engine){
		this.levelField = levelField;
		this.levelButton = levelButton;
		this.fileLoader = fileLoader;
		this.engine = engine;
		this.levelLabel = document.querySelector("#levelLabel");
		this.roomContainer = document.querySelector("#roomContainer");
		this.levelName = "";
		this.roomList = null;

		this.levelOBJ = null; //where level data is stored

		this.start = ()=>{
			this.levelButton.addEventListener('click', ()=>{
				this.fileLoader.loadJSON(this.levelField, this.levelOBJ, (e)=>{
					this.loadLevel(JSON.parse(e.target.result));
					console.log("Level loaded successfully");
					console.log(this.levelOBJ);

				})

			})
		}

		this.loadLevel = (levelOBJ)=>{
			this.levelOBJ = levelOBJ;

			this.clearPage();

			this.setLevelName(this.levelOBJ.name);

			this.loadRooms(this.levelOBJ.rooms);

		}

		this.refreshLevel = ()=>{

			this.clearPage();

			this.loadRooms(this.levelOBJ.rooms);
		}

		this.setLevelName = (newName)=>{
			this.levelName = newName;
			this.levelLabel.innerHTML = `<i>${this.levelName}</i>`;
		}

		this.setEngine = (engine)=>{
			this.engine = engine;
		}

		this.clearPage = ()=>{
			this.roomContainer.innerHTML = "";
		}

		this.loadRooms = (roomList)=>{
			console.log(roomList)
			this.roomList = roomList;
			for(let i in roomList){
				let roomObject = new RoomDOMObject(roomList[i], this.roomContainer, this.levelOBJ, this.engine);
				roomObject.init();
			}
		}

	}
}