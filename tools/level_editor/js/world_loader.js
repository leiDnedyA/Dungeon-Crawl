
//loads in level json file
class WorldLoader {
	constructor(levelField, levelButton, fileLoader, engine){
		this.levelField = levelField;
		this.levelButton = levelButton;
		this.fileLoader = fileLoader;
		this.engine = engine;
		this.levelLabel = document.querySelector("#levelLabel");
		this.roomContainer = document.querySelector("#roomContainer");
		this.downloadButton = document.querySelector("#levelDownload");
		this.changeLevelName = document.querySelector("#changeLevelName");
		this.newRoomButton = document.querySelector("#newRoom")
		this.levelName = "";
		this.roomList = null;
		this.editorInterface = null; //has to be set on init

		this.levelOBJ = null; //where level data is stored

		this.start = ()=>{
			this.levelButton.addEventListener('click', ()=>{
				this.fileLoader.loadJSON(this.levelField, this.levelOBJ, (e)=>{
					this.loadLevel(JSON.parse(e.target.result));
					console.log("Level loaded successfully");
					console.log(this.levelOBJ);

					this.init();

				})

			})
		}

		this.init = ()=>{ //sets up all the buttons and stuff
			this.downloadButton.disabled = false;
			this.changeLevelName.disabled = false;
			this.newRoomButton.disabled = false;
			this.downloadButton.addEventListener("click", ()=>{
				this.fileLoader.exportJSON(this.levelOBJ);
			});
			this.changeLevelName.addEventListener("input", ()=>{
				this.setLevelName(this.changeLevelName.value);
			})
			this.newRoomButton.addEventListener("click", ()=>{
				this.newRoom();
			})

		}

		this.loadLevel = (levelOBJ)=>{
			this.levelOBJ = levelOBJ;

			this.clearPage();

			this.setLevelName(this.levelOBJ.name);

			this.loadRooms(this.levelOBJ.rooms);

			this.editorInterface.loadRoom(this.levelOBJ.rooms[this.levelOBJ.startRoom])

		}

		this.refreshLevel = ()=>{

			this.clearPage();

			this.loadRooms(this.levelOBJ.rooms);
		}

		this.setLevelName = (newName)=>{
			this.levelOBJ.name = String(newName);
			this.levelName = newName;
			this.levelLabel.innerHTML = `<i>${this.levelName}</i>`;
			this.changeLevelName.value = this.levelName;
		}

		this.setEngine = (engine)=>{
			this.engine = engine;
		}

		this.setEditorInterface = (editorInterface)=>{
			this.editorInterface = editorInterface;
		}

		this.clearPage = ()=>{
			this.roomContainer.innerHTML = "";
		}

		this.loadRooms = (roomList)=>{ //loads entire list of rooms, single rooms are loaded with the onclick method for the "load" buttons
			console.log(roomList)
			this.roomList = roomList;
			for(let i in roomList){
				let roomObject = new RoomDOMObject(roomList[i], this.roomContainer, this.levelOBJ, this.engine, this.fileLoader);
				roomObject.init();
			}


		}

		this.newRoom = ()=>{

			let defaultName = "New Room";
			let i = 0;
			while(this.levelOBJ.rooms.hasOwnProperty(`${defaultName} (${i})`)){
				i++;
			}

			let fullName = `${defaultName} (${i})`;

			this.levelOBJ.rooms[fullName] = new Room(fullName);

			this.refreshLevel();


		}

	}
}