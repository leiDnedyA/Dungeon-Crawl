const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> '
})

const commandOBJ = {
	kick : (input)=>{

	},
	ban : (input)=>{

	},
	chat : (input)=>{
		let message = input.split(' ').slice(1).join(' ');
		console.log(`SERVER: ${message}`);
	},
	userlist : (input, clientList)=>{
		console.log(clientList)
		let users;
		if(clientList){
			users = clientList.map((e)=>{
			return e.name;
		})
			users = users.join(", ");
		}
		console.log(`User list: ${users}`);
	},
	help : (input)=>{
		let splitInput = input.split(' ');
		if(splitInput.length == 1){
			console.log(`COMMAND LIST: ${Object.keys(commandDesc).join(', ')}`)
		}else{
			if(commandDesc.hasOwnProperty(splitInput[1])){
				console.log(commandDesc[splitInput[1]]);
			}else{
				console.log(`ERROR: There is no command '${splitInput[1]}'. Type 'help' to see list of commands.`);
			}
		}
	}
}

const commandDesc = {
	kick : "USAGE: kick <playername> \n ends player's session",
	ban : "USAGE: ban <playername> \n bans player from server (ip ban)",
	chat : "USAGE: chat <message> \n emits a chat message from the server to all clients",
	help : "USAGE: help <command> \n gets list of commands and explains their usage"
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

		this.clearLine = ()=>{
		}

		this.recursiveCommand = ()=>{
			rl.question('> ', (input)=>{
				this.handleCommand(input, this.clientList);
				this.recursiveCommand();
			})
		}

		this.start = ()=>{
			this.recursiveCommand();
		}


	}
}

module.exports = CommandHandler;