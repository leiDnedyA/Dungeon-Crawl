
class FileLoader {
	constructor(){
		this.fileReader = new FileReader();

		this.setSrcFromUpload = (uploadElement, destination, callback)=>{
			
			let file = uploadElement.files[0];

			this.fileReader.addEventListener("load", ()=>{
				destination.src = this.fileReader.result;
				setTimeout(callback, 300);
			})
			if(file){
				this.fileReader.readAsDataURL(file);
			}else{
				alert("UPLOAD ERROR: No file selected")
			}
		}

		this.exportJSON = ()=>{
			
		}

	}
}