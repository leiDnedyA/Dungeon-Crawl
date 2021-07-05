const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const commandOBJ = {
	kick : (input)=>{

	},
	ban : (input)=>{

	},
	chat : (input)=>{
		let message = input.split(' ').slice(1).join(' ');
		console.log(`SERVER: ${message}`);
	}
}

class CommandHandler {
	constructor(clientList){
		this.clientList = clientList;

		this.handleCommand = (input)=>{
			if(input){
				let commandHeader = input.split(' ')[0];
				if(commandOBJ.hasOwnProperty(commandHeader)){
					commandOBJ[commandHeader](input);
				}else{
					console.log(`COMMAND INVALID: "${commandHeader}" type 'help' to see list of commands...`);
				}
			}
		}

		this.start = ()=>{
			rl.on('line', (input)=>{
				this.handleCommand(input);
			})
		}


	}
}

module.exports = CommandHandler;