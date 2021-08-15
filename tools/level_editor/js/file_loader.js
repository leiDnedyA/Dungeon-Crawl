
class FileLoader {
	constructor(){
		this.fileReader = new FileReader();

		this.loadJSON = (uploadElement, destination, callback)=>{
			
			let file = uploadElement.files[0];

			this.fileReader.addEventListener('load', (e)=>{
				callback(e);
			})

			this.fileReader.readAsText(file);

		}

		this.exportJSON = (obj)=>{
			let name = obj.name;
			let json = JSON.stringify(obj);
			let blob = new Blob([json], {type: "application/json"});
			let url = URL.createObjectURL(blob);

			saveAs(blob, name);
		}

	}
}