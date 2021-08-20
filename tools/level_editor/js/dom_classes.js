
//to get to room folder
const srcRegex = /\/img\/rooms\//
const srcString = '/img/rooms/'

class RoomDOMObject {
	constructor(roomOBJ, parentElement, worldOBJ, engine, fileLoader){
		this.roomOBJ = roomOBJ;
		this.parentElement = parentElement;
		this.worldOBJ = worldOBJ;
		this.engine = engine;
		this.renderer = this.engine.renderer;
		this.fileLoader = fileLoader;

		//putting together main DOM object
		this.domElement = document.createElement("div");
		this.titleElement = document.createElement("p");
		this.titleElement.classList.add("titleElement");
		this.titleElement.innerHTML = `${this.roomOBJ.name}`;
		this.domElement.appendChild(this.titleElement);
		
		//main table element
		this.mainTableElement = document.createElement("table");
		this.domElement.appendChild(this.mainTableElement);
		
		//walkable area stuff
		this.walkableAreaElement = document.createElement("div");
		this.walkableAreaOBJ = new PolygonDOMElement(this.roomOBJ.walkable.main, this.walkableAreaElement, "Walkable Area");

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
			"functions" : this.functionsOBJ.getButtonList(),
			"doors" : this.doorTableElement,
			"walkable area" : this.walkableAreaElement,
			"background" : this.bgLoader.getElementList(),
		};


		this.init = ()=>{

			this.bgLoader.init()
			this.functionsOBJ.init();
			this.walkableAreaOBJ.setRenderer(this.engine.getRenderer());
			this.walkableAreaOBJ.init();

			//loading all door stuff
			this.doorTableElement.innerHTML = "";
			let headerRow = document.createElement("tr");
			headerRow.innerHTML = "<th>Destination</th><th>Position</th>";
			this.doorTableElement.appendChild(headerRow);

			for(let i in this.roomOBJ.doors){
				let doorContainer = new DoorDOMObject(this.roomOBJ.doors[i], this.doorTableElement, this.renderer);
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
	constructor(doorOBJ, parentElement, renderer){
		this.parentElement = parentElement;
		this.doorOBJ = doorOBJ;

		// this.position = this.doorOBJ.position;
		this.box = this.doorOBJ.box;
		this.destination = this.doorOBJ.destination;
		this.isLocked = this.doorOBJ.isLocked;
		this.renderer = renderer;
		// this.size = this.doorOBJ.size;

		//creates the DOM element that all of the children elements will work within
		this.domElement = document.createElement("tr");
		this.titleElement = document.createElement("td")
		/*this.posButtonElement = document.createElement("button");*/
		this.boxElement = document.createElement("td");
		
		this.polygonDOMElement = new PolygonDOMElement(this.box, this.boxElement, 'box', this.renderer);

		this.elementsList = [this.titleElement, this.boxElement];

		this.init = ()=>{

			//setting up parts of DOM element
			
			this.titleElement.innerHTML = `<i>${this.destination}</i>`;
			
			/* this.posButtonElement.innerHTML = "set position"; */


			this.polygonDOMElement.init();

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
		this.editorInterface = engine.editorInterface;

		//this button will load the room onto the screen
		this.loadRoomButton = document.createElement("button");
		this.loadRoomButton.innerHTML = "Load Room";

		//delete room button
		this.deleteRoomButton = document.createElement("button");
		this.deleteRoomButton.innerHTML = "Delete Room";

		this.buttonList = [this.loadRoomButton, this.deleteRoomButton];

		this.init = ()=>{
			this.loadRoomButton.addEventListener("click", ()=>{ //loads room into renderer (and other stuff in future)
				this.editorInterface.loadRoom(this.main.roomOBJ);
			});
		}

		this.getButtonList = ()=>{ //returns a list containing all buttons
			return this.buttonList;
		}

	}
}

class PolygonDOMElement {
	constructor(polygon, parentElement, title = "polygon", renderer){
		this.polygon = parseIntPoints(polygon);
		this.parentPolygon = polygon;
		this.parentElement = parentElement;
		this.title = title;
		this.greenClass = "selectedPointContainer";
		this.renderer = renderer;
		// this.renderer = null; //needs to be set with setRenderer

		this.mainDiv = document.createElement("div");
		this.textElement = document.createElement("p");

		this.setRenderer = (renderer)=>{
			this.renderer = renderer;
			// console.log(renderer)
		}

		this.init = ()=>{

			this.textElement.innerHTML = `${title}: ${this.polygon.map((e)=>{
				return `[${e[0]}, ${e[1]}] `
			})}`;

			/* this creates a single p element with all of the points' coordinates
			this.textElement.innerHTML = `${title}: ${this.polygon.map((e)=>{
				return `[${e[0]}, ${e[1]}] `
			})}`;
			*/
			
			this.mainDiv.appendChild(this.textElement);

			for(let i in this.polygon){
				// console.log(this.polygon[i])
				let pointContainer = document.createElement("div");
				pointContainer.setAttribute("class", "pointContainer");

				let coords = this.polygon[i];

				let inputList = [];

				for(let j in coords){
					let numInput = document.createElement("input");
					
					inputList.push(numInput);

					numInput.setAttribute("type", "number");
					numInput.setAttribute("class", "coordInput")
					numInput.value = coords[j];
					// console.log(this.renderer)
					numInput.addEventListener("click", ()=>{
						// console.log(this.renderer)
						pointContainer.classList.add(this.greenClass);
						this.renderer.setSelectedPoint(this.polygon[i], (newPoint)=>{
							this.parentPolygon[i] = [String(newPoint[0]), String(newPoint[1])];
							this.polygon[i] = newPoint;
							
							for(let q in inputList){
								inputList[q].value = newPoint[q];
							}

							console.log(this.parentPolygon[i])
						}, ()=>{
							pointContainer.classList.remove(this.greenClass)
						});
					})

					pointContainer.appendChild(numInput);

				}

				this.mainDiv.appendChild(pointContainer);
			}

			this.parentElement.appendChild(this.mainDiv);
		}

		this.getStringPolygon = ()=>{
			return parseStringPoints(this.polygon);
		}

		this.getPolygon = ()=>{
			return this.polygon;
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
			this.setButton.addEventListener("click", ()=>{ //
				let e = expandSRC(this.fileNameInput.value);
				this.checkImageFirst(e, ()=>{
					this.main.roomOBJ.background = e;
				})
			})
		}

		this.checkImageFirst = (src, callback)=>{
			let http = new XMLHttpRequest();

			http.open('HEAD', src, false);
			
			http.addEventListener("load", (e)=>{
				console.log(`Level bg successfully changed to '${cutSRC(src)}'`)
				callback();
			});

			http.addEventListener("error", (e)=>{
				console.error("La imagen no existe");
			});

			http.send(null);


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
	if(srcRegex.test(longVersion))
		return longVersion.replace(srcRegex, "");
	return ""
}

const expandSRC = (shortVersion)=>{ //adds directory to src
	return srcString + String(shortVersion);
}

const parseIntPoints = (pointList)=>{
	
	return pointList.map((e)=>{
		return [parseInt(e[0]), parseInt(e[1])]
	})

}

const parseStringPoints = (pointList)=>{
	return pointList.map((e)=>{
		return [`${e[0]}`, `${e[1]}`]
	})	
}