const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> '
})

const inpError = (input)=>{
	console.log(`"${input}" is not a valid input. Please type "help" to see a list of commands and "help <command name>" to see the correct syntax for the command.`);
}

const commandOBJ = {
	kick : (input, clientList)=>{
		let message = input.split(' ');
		if(message.length != 3){
			inpError(input);
			return;
		}
		let mode = message[1];
		let id = message[2];
		let targetList = [];
		if(mode == "ip"){
			for(let i in clientList){
				if(clientList[i].ip == id){
					targetList.push(clientList[i]);
				}
			}
		}else if(mode == "player"){
			for(let i in clientList){
				if(clientList[i].name == id){
					targetList.push(clientList[i]);
				}
			}
		}else{
			inpError(input);
			console.log(`INPUT ERROR: "${mode}" is not a valid option`)
			return;
		}

		for(let i in targetList){
			targetList[i].kick(null);
		}

	},
	ban : (input, clientList)=>{

	},
	chat : (input)=>{
		let message = input.split(' ').slice(1).join(' ');
		console.log(`SERVER: ${message}`);
	},
	userlist : (input, clientList)=>{
		
		let splitInput = input.split(' ');
		let room = splitInput[1];
		let users = [];
		if(clientList){
			for(let i in clientList){
				if(room){
					if(clientList[i].room == room){
						users.push(clientList[i].name);
					}
				}else{
					users.push(clientList[i].name);
				}
			}
			users = users.join(", ");
		}
		if(room){
			console.log(`USERS IN ROOM "${room}": ${users}`)
		}else{
			console.log(`USERS ON SERVER: ${users}`);
		}
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
	kick : "USAGE: kick [ip | player] <ip | playername> \n ends player's session",
	ban : "USAGE: ban [ip | player] <ip | playername> \n bans player from server (ip ban)",
	chat : "USAGE: chat <message> \n emits a chat message from the server to all clients",
	userlist: "USAGE: userlist <room>",
	help : "USAGE: help <command> \n gets list of commands and explains their usage"
}

class CommandHandler {
	constructor(clientList){
		this.clientList = clientList;

		this.handleCommand = (input)=>{
			if(input){
				let commandHeader = input.split(' ')[0];
				if(commandOBJ.hasOwnProperty(commandHeader)){
					commandOBJ[commandHeader](input, clientList);
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