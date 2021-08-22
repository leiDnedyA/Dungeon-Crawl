
//to get to room folder
const srcRegex = /\/img\/rooms\//
const srcString = '/img/rooms/'
const defNewPoint = [10, 10] //default position for when a new point is added to a polygon

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
		this.doorStuffContainer = document.createElement("div");
		this.doorTableElement = document.createElement("table");
		this.newDoorButton = document.createElement("button");
		this.newDoorButton.innerHTML = "New Door";
		this.doorContainerList = [];
		this.doorStuffContainer.appendChild(this.doorTableElement);
		this.doorStuffContainer.appendChild(this.newDoorButton)

		//misc function buttons stuff
		this.functionsOBJ = new RoomFunctionsOBJ(this, this.engine);

		//background loading stuff
		this.bgLoader = new BGLoader(this);

		//container for all the stuff thats going into the main table
		this.mainTableContents = {
			"title" : this.titleElement,
			"functions" : this.functionsOBJ.getButtonList(),
			"doors" : this.doorStuffContainer,
			"walkable area" : this.walkableAreaElement,
			"background" : this.bgLoader.getElementList(),
		};

		this.refresh = ()=>{
			this.engine.worldLoader.loadLevel(this.worldOBJ);
		}

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
				let doorContainer = new DoorDOMObject(this.roomOBJ.doors[i], this.doorTableElement, this.renderer, this.worldOBJ, this.refresh);
				this.doorContainerList.push(doorContainer);
				doorContainer.init();
			}


			//adding onClick to new door button
			this.newDoorButton.addEventListener("click", ()=>{
				this.roomOBJ.doors.push(new Door(this.worldOBJ.startRoom));
				console.log(this.worldOBJ)
				this.refresh()
			})

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

		this.moveToTop = ()=>{ //moves dom element to top of list of rooms
			this.parentElement.removeChild(this.domElement);
			this.parentElement.prepend(this.domElement);
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
	constructor(doorOBJ, parentElement, renderer, worldOBJ, refresh){
		this.parentElement = parentElement;
		this.doorOBJ = doorOBJ;
		this.worldOBJ = worldOBJ;

		// this.position = this.doorOBJ.position;
		this.box = this.doorOBJ.box;
		this.destination = this.doorOBJ.destination;
		this.isLocked = this.doorOBJ.isLocked;
		this.renderer = renderer;
		// this.size = this.doorOBJ.size;

		this.refresh = refresh; //method for refreshing entire layout after change made

		//creates the DOM element that all of the children elements will work within
		this.domElement = document.createElement("tr");
		this.destinationSelectElement = document.createElement("select");
		this.titleElement = document.createElement("td")
		/*this.posButtonElement = document.createElement("button");*/
		this.boxElement = document.createElement("td");
		
		this.polygonDOMElement = new PolygonDOMElement(this.box, this.boxElement, '', this.renderer);

		this.elementsList = [this.titleElement, this.boxElement];

		this.init = ()=>{

			//setting up parts of DOM element
			
			this.titleElement.appendChild(this.destinationSelectElement);

			let roomList = Object.keys(this.worldOBJ.rooms);

			for(let i in roomList){
				// console.log(roomList[i])
				let roomOption = document.createElement("option");
				roomOption.innerHTML = roomList[i];
				this.destinationSelectElement.appendChild(roomOption)
			}
			
			this.destinationSelectElement.value = this.doorOBJ.destination;

			this.destinationSelectElement.addEventListener("change", ()=>{
				this.doorOBJ.destination = this.destinationSelectElement.value;
				this.refresh()
			})

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
				this.main.moveToTop();
			});
		}

		this.getButtonList = ()=>{ //returns a list containing all buttons
			return this.buttonList;
		}

	}
}

class PolygonDOMElement {
	constructor(polygon, parentElement, title = "", renderer){
		this.polygon = parseIntPoints(polygon);
		this.parentPolygon = polygon;
		this.parentElement = parentElement;
		this.title = title;
		this.renderer = renderer;
		// this.renderer = null; //needs to be set with setRenderer

		this.mainDiv = document.createElement("div");
		this.textElement = document.createElement("p");

		this.newPointButton = document.createElement("button");
		this.newPointButton.innerHTML = "New Point"

		this.setRenderer = (renderer)=>{
			this.renderer = renderer;
			// console.log(renderer)
		}

		this.newPoint = (point)=>{
			console.log(this.polygon)
			this.polygon.push(point)
			this.parentPolygon.push([String(point[0]), String(point[1])]);
			this.mainDiv.innerHTML = "";
			this.init();
		}

		this.init = ()=>{

			if (title.length > 0){
				this.textElement.innerHTML = `${title}: `;	
			}
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

				let deleteButton = document.createElement("button");
				deleteButton.innerHTML = "Delete Point";

				deleteButton.addEventListener("click", ()=>{
					let confirmAction = confirm(`Are you sure you want to delete this point?`);
					if(confirmAction){
						this.polygon.splice(i, 1);
						this.parentPolygon.splice(i, 1);
						pointContainer.remove();
						this.inputList.splice(i, 1)
						for(let f in this.inputList){
							this.inputList[f].updateIndex(f);
						}
					}
				})

				let coords = this.polygon[i];

				this.inputList = [];

				for(let j in coords){
					let numInput = new NumInputElement(pointContainer, coords[j], this.parentPolygon, this.polygon, [i, j], this.renderer);
					
					numInput.init()

					this.inputList.push(numInput);

					pointContainer.appendChild(numInput.getDomElement());

				}

				pointContainer.appendChild(deleteButton);

				this.mainDiv.appendChild(pointContainer);
			}

			this.mainDiv.appendChild(this.newPointButton)

			this.parentElement.appendChild(this.mainDiv);

			this.newPointButton.addEventListener("click", ()=>{
				this.newPoint(defNewPoint)
			});
		}

		this.getStringPolygon = ()=>{
			return parseStringPoints(this.polygon);
		}

		this.getPolygon = ()=>{
			return this.polygon;
		}

	}
}

class NumInputElement {
	constructor(parentElement, defaultValue, parentPolygon, polygon, index, renderer){
		this.parentElement = parentElement;
		this.defaultValue = defaultValue;
		this.parentPolygon = parentPolygon;
		this.polygon = polygon;
		this.index = index; //format : [coordinates for pair, coordinate within pair]
		this.renderer = renderer;

		this.greenClass = "selectedPointContainer";

		this.domElement = document.createElement("input");

		this.init = ()=>{
			this.domElement.setAttribute("type", "number");
			this.domElement.setAttribute("class", "coordInput")
			this.domElement.value = this.polygon[this.index[0]][this.index[1]];
			// console.log(this.polygon)
			// console.log(this.index)
			// console.log(this.renderer)
			this.domElement.addEventListener("click", ()=>{
				// console.log(this.renderer)
				if(!parentElement.classList.contains(this.greenClass)){
					parentElement.classList.add(this.greenClass);
				}
				this.renderer.setSelectedPoint(this.polygon[this.index[0]], (newPoint)=>{
					this.parentPolygon[this.index[0]] = [String(newPoint[0]), String(newPoint[1])];
					this.polygon[this.index[0]] = newPoint;
					
					for(let i in this.parentElement.childNodes){
						if(i == 0 || i == 1){
							this.parentElement.childNodes[i].value = newPoint[i];
						}
					}

				}, ()=>{
					this.parentElement.classList.remove(this.greenClass)
				});
			})
			this.domElement.addEventListener("change", ()=>{
				this.parentPolygon[this.index[0]][this.index[1]] = String(this.domElement.value);
				this.polygon[index[0]][index[1]] = this.domElement.value;
				this.domElement.click()
			})

		}

		this.updateIndex = (newIndex)=>{
			this.index[0] = newIndex;

			this.domElement.value = this.polygon[this.index[0]][this.index[1]];
		}

		this.getDomElement = ()=>{
			return this.domElement;
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
	


	if(pointList){
		return pointList.map((e)=>{
			return [parseInt(e[0]), parseInt(e[1])]
		})
	}else{
		console.error("")
		return [0, 0]
	}

}

const parseStringPoints = (pointList)=>{
	return pointList.map((e)=>{
		return [`${e[0]}`, `${e[1]}`]
	})	
}