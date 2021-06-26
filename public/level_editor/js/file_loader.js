
class FileLoader {
	constructor(){
		this.fileReader = new FileReader();

		this.setSrcFromUpload = (uploadElement, destination)=>{
			
			let file = uploadElement.files[0];

			this.fileReader.addEventListener("load", ()=>{
				destination.src = this.fileReader.result;
			})
			if(file){
				this.fileReader.readAsDataURL(file);
			}
		}

	}
}