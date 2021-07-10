
class ChatHandler {
	constructor(engine, client, input, submitButton){
		
		//an object literal for different numbers that might change
		this.defaults = {
			submitWidth : "100%"
		}

		//references to engine and client
		this.engine = engine;
		this.client = client;
		
		this.input = input;
		this.canvas = this.engine.renderer.canvas;
		this.submitButton = submitButton;
		
		//grays out the html elements for the chat until player is connected
		this.submitButton.disabled = true;
		this.input.disabled = true;

		//stores live messages, which are deleted after their duration runs out
		this.liveMessages = [];

		this.start = ()=>{
			this.submitButton.disabled = false;
			this.input.disabled = false;
			this.engine.addUpdFunc(this.updFunc)

			this.submitButton.addEventListener('click', ()=>{
				// console.log(this.input.value)
				if(this.input.value){
					this.client.sendChat(this.input.value);
					this.input.value = '';
				}
			})

			this.input.addEventListener('keypress', (e)=>{
				if(e.key == 'Enter'){
					this.submitButton.click();
				}
			})
		}

		this.newMessage = (text, senderID)=>{
			this.liveMessages.push(new Message(text, senderID));
		}

		this.refreshMessages = ()=>{
			for(let i in this.liveMessages){
				let msg = this.liveMessages[i];
				let seconds = 1000;
				if(new Date().getTime() - msg.start > msg.duration * seconds){
					this.liveMessages.splice(i, 1);
				}
			}
		}


		this.resizeElements = ()=>{

			
			
		}

		this.updFunc = ()=>{
			this.resizeElements();
			this.refreshMessages();
		}


	}
}

class Message {
	constructor(text, senderID, duration = 5){
		this.text = text;
		this.start = new Date().getTime();
		this.senderID = senderID;
		this.duration = duration;
	}
}