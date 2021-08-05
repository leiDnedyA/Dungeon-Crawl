
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

		this.exportJSON = ()=>{
			
		}

	}
}