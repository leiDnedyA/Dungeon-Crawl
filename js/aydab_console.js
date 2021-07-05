
class AydabConsole {
	constructor(commandHandler){
		this.commandHandler = commandHandler;

		this.log = (input)=>{
			this.commandHandler.clearLine();
			process.stdout.write("\r\x1b[K");
			console.log(`${input}`);
			this.commandHandler.recursiveCommand();
		}
	}
}

module.exports = AydabConsole;