
const srcRegex = /\/img\/rooms\//

class RoomDOMObject {
	constructor(roomOBJ, parentElement, worldOBJ, engine){
		this.roomOBJ = roomOBJ;
		this.parentElement = parentElement;
		this.worldOBJ = worldOBJ;
		this.engine = engine;

		//putting together main DOM object
		this.domElement = document.createElement("div");
		this.titleElement = document.createElement("p");
		this.titleElement.classList.add("titleElement");
		this.titleElement.innerHTML = `${this.roomOBJ.name}`;
		this.domElement.appendChild(this.titleElement);
		
		//main table element
		this.mainTableElement = document.createElement("table");
		this.domElement.appendChild(this.mainTableElement);
		
		//door stuff(gets set up more in this.init)
		this.doorTableElement = document.createElement("table");
		this.doorContainerList = [];		

		//misc function buttons stuff
		this.functionsOBJ = new RoomFunctionsOBJ(this, this.engine);

		//background loading stuff
		this.bgLoader = new BGLoader(this);

		//container for all the stuff thats going into the main table
		this.mainTableContents = {
			"title" : this.titleElement,
			"doors" : this.doorTableElement,
			"background" : this.bgLoader.getElementList(),
			"functions" : this.functionsOBJ.getButtonList(),
		};


		this.init = ()=>{

			this.bgLoader.init()
			this.functionsOBJ.init();

			//loading all door stuff
			this.doorTableElement.innerHTML = "";
			let headerRow = document.createElement("tr");
			headerRow.innerHTML = "<th>Destination</th><th>Position</th>";
			this.doorTableElement.appendChild(headerRow);

			for(let i in this.roomOBJ.doors){
				let doorContainer = new DoorDOMObject(this.roomOBJ.doors[i], this.doorTableElement);
				this.doorContainerList.push(doorContainer);
				doorContainer.init();
			}


			//loading all elements into main table

			for(let i in this.mainTableContents){
				let tr = document.createElement("tr")
				
				let rowName = document.createElement("p");
				rowName.innerHTML = i;
				tr.appendChild(makeTD(rowName))
				tr.appendChild(makeTD(this.mainTableContents[i]))

				this.mainTableElement.appendChild(tr);
			}

			// this.domElement.appendChild()

			this.parentElement.appendChild(this.domElement);
		}

		this.getElement = ()=>{
			return this.domElement;
		}
		this.getName = ()=>{
			return this.roomOBJ.name;
		}

		this.getRoomOBJ = ()=>{
			return this.roomOBJ;
		}

	}
}

class DoorDOMObject {
	constructor(doorOBJ, parentElement){
		this.parentElement = parentElement;
		this.doorOBJ = doorOBJ;

		this.position = this.doorOBJ.position;
		this.destination = this.doorOBJ.destination;
		this.isLocked = this.doorOBJ.isLocked;
		this.size = this.doorOBJ.size;

		//creates the DOM element that all of the children elements will work within
		this.domElement = document.createElement("tr");
		this.titleElement = document.createElement("td")
		/*this.posButtonElement = document.createElement("button");*/
		this.posTextElement = document.createElement("td");

		this.elementsList = [this.titleElement, /*this.posButtonElement,*/ this.posTextElement];

		this.init = ()=>{

			//setting up parts of DOM element
			
			this.titleElement.innerHTML = `<i>${this.destination}</i>`;
			
			/* this.posButtonElement.innerHTML = "set position"; */

			this.posTextElement.innerHTML = `position: [${this.position}]`;
			

			/* this.posButtonElement.addEventListener("click", ()=>{
				console.log("posButton clicked")
				this.posTextElement.innerHTML = this.position;
			}) */
			

			for(let i in this.elementsList){
				this.domElement.appendChild(this.elementsList[i]);
			}

			this.parentElement.appendChild(this.domElement);
		}


	}
}

class RoomFunctionsOBJ {
	constructor(main, engine){
		//reference to parent instance of RoomDOMObject
		this.main = main;
		this.engine = engine;

		//this button will load the room onto the screen
		this.loadRoomButton = document.createElement("button");
		this.loadRoomButton.innerHTML = "Load Room";

		this.buttonList = [this.loadRoomButton];

		this.init = ()=>{
			this.loadRoomButton.addEventListener("click", ()=>{ //loads room into renderer (and other stuff in future)
				this.engine.renderer.loadRoom(this.main.roomOBJ);
			});
		}

		this.getButtonList = ()=>{ //returns a list containing all buttons
			return this.buttonList;
		}

	}
}

class BGLoader { //generates the HTML elements to load backgrounds for each level
	constructor(main){
		this.main = main;

		this.fileNameLabel = document.createElement("label");
		this.fileNameLabel.innerHTML = "File name in rooms folder: ";
		this.fileNameInput = document.createElement("input");
		this.fileNameInput.setAttribute("placeholder", "filename.png");
		this.setButton = document.createElement("button");
		this.setButton.innerHTML = "set";

		this.elementList = [this.fileNameLabel, this.fileNameInput, this.setButton];

		this.init = ()=>{
			this.roomOBJ = this.main.getRoomOBJ();
			this.fileNameInput.value = cutSRC(this.roomOBJ.background);
			this.setButton.addEventListener("click", (e)=>{ //
				this.main.roomOBJ.background = expandSRC(this.fileNameInput.value);
			})
		}

		this.getElementList = ()=>{
			return this.elementList;
		}

	}
}

//helper function that puts single element or list of elements into a <td> tag
const makeTD = (elements)=>{
	let td = document.createElement("td");
	if(Array.isArray(elements)){
		for(let i in elements){
			td.appendChild(elements[i]);
		}
	}else{
		td.appendChild(elements);
	}
	return td;
}

const cutSRC = (longVersion)=>{ //converts raw src to correct one for input field
	return longVersion.replace(srcRegex, "");
}

const expandSRC = (shortVersion)=>{ //adds directory to src
	return srcRegex.toString() + shortVersion;
}