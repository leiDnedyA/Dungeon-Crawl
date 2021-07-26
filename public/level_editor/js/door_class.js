
class DoorDOMObject {
	constructor(parentOBJ, position, destination, jsonData){
		this.parentOBJ = parentOBJ;
		this.position = position;
		this.destination = destination;
		this.jsonData = jsonData;

		//creates the DOM element that all of the children elements will work within
		this.domElement = document.createElement("div");
		this.obj = {
			domElement: this.domElement,
			posButton: document.createElement("button"),
			position: document.createElement("p")
		}

		this.start = ()=>{

			//setting up parts of DOM element
			this.obj.posButton.innerHTML = "set position";
			this.obj.position.innerHTML = this.position;
			this.obj.posButton.addEventListener("click", ()=>{
				console.log("posButton clicked")
				this.object.position.innerHTML = this.position;
			})
			
			for(let i in this.obj){
				if(i != "domElement"){
					this.domElement.appendChild(this.obj[i]);
				}
			}

			this.parentOBJ.appendChild(this.domElement);
		}


	}
}