//writes contents of server_msg.txt to console
const requireText = require('require-text');
const chalk = require('chalk');
console.clear()
console.log(requireText('./server_msg.txt', require).split('').map((a)=>{
	if(a == '$'){
		return chalk.cyan(a);
	}else{
		return chalk.gray(a);
	}
}).join(''));

//imports and initializes all modules
const config = require('./config.json');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = new socket.Server(server)
const CharController = require('./js/backend_character_controller.js')
const Engine = require('./js/engine.js')
const RoomLoader = require('./js/room_loader.js')
const levelJSON = require('./levels/test_level.json')
const {Vector2, addVectors} = require('./js/aydab_geometry.js')
const ChatFilter = require('./js/chat_filter.js')
const banList = require('./banned_users.json')
const commandHandler = require('./js/command_handler.js');
const AydabConsole = require('./js/aydab_console.js');
const JoinFilter = require('./js/join_filter.js');

const configOptions = ["maxPlayersPerIP", "defaultPlayerSize", "chatCharLimit", "chatMinWait", "maxSpamAttempts", "nameCharLimit", "maxIdleMinutes", "playerSpeed"];

for(let i in configOptions){
	if(!config.hasOwnProperty(configOptions[i])){
		console.error(`${chalk.red('WARNING')}: config.json missing element: ${configOptions[i]}`);
	}
}

//player and client lists
var clientList = {}
var playerList = {}

//config variables
const frameRate = 30;
const port = 80;
const defaultPlayerSize = parseInt(config["defaultPlayerSize"]);
const hostIP = config.hostIP;
const engine = new Engine(frameRate, playerList);
const chatFilter = new ChatFilter();
const joinFilter = new JoinFilter(banList, clientList)
const roomLoader = new RoomLoader(levelJSON);
engine.start();
engine.roomLoader = roomLoader;


//initializes command handler
const commands = new commandHandler(clientList);
const aydabConsole = new AydabConsole(commands);

//express server setup
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static('assets'));

//socket server setup
io.on('connection', (socket)=>{
	// console.log(`user connected at IP: ${socket.handshake.address}`);
	let startRoom = roomLoader.getStart();
	let player = new Player(socket, engine, getStartCords(startRoom), new Vector2(defaultPlayerSize, defaultPlayerSize)/*Eventually this is gonna have to get synced with server*/); 
	// console.log(player.position)
	player.setIP(socket.handshake.address);
	clientList[player.id] = player;
	playerList[player.id] = player;
	player.room = startRoom;

	if(player.ip == hostIP){
		// player.afkExcempt = true;
		aydabConsole.log(`The host has joined at IP: ${chalk.cyan(player.ip)}`);
	}

	// player.position = new Vector2()
	player.start();
	
	if(joinFilter.filter(player)){
		socket.on('start', (data)=>{
			player.setName(data.name);
			if(joinFilter.filterName(player)){
				player.setName(data.name);		
				aydabConsole.log(`[${getTimeStamp()}] : ${data.name} has joined the world (IP: ${player.ip})`)
				emitConnection(player, clientList);
				emitPlayerSetup(player, playerList);
				emitRoom(player);
			}

		})
	}

	if(joinFilter.filter(player)){
		socket.on('start', (data)=>{
			player.setName(data.name);		
			aydabConsole.log(`[${getTimeStamp()}] : ${data.name} has joined the world (IP: ${player.ip})`)
			emitConnection(player, clientList);
			emitPlayerSetup(player, playerList);
			emitRoom(player);

		})
	}


	

	// console.log(clientList);

	socket.on('disconnect', ()=>{
		if(player.name){
			aydabConsole.log(`[${getTimeStamp()}] : user ${chalk.cyan(player.name)} disconnected at IP: ${socket.handshake.address}`);
		}
		playerList[player.id].end();
		delete playerList[player.id];
		delete clientList[player.id];
		
		emitDisconnection(player, clientList);

	});


})


//http server setup
server.listen(port, ()=>{
	console.log(`${chalk.bgGreen('SUCCESS')} : Server started on port ${port}`);
	
	commands.start(); //start of command input being accepted
	
	//function that updates all players
	engine.addUpdateFunc('MAIN', ()=>{
		// let data = {};
		// for(let j in playerList){
		// 	data[j] = {
		// 		'position' : [playerList[j].position.x, playerList[j].position.y],
		// 		'id' : j
		// 	}
		// }
		// for(let i in clientList){
		// 	clientList[i].socket.emit('entityData', data)
		// }
		for(let i in clientList){
			let data = {};
			for(let j in playerList){
				if(playerList[j].room == playerList[i].room){
					data[j] = {
						'position' : [playerList[j].position.x, playerList[j].position.y],
						'id' : j			
					}
				}
			}
			clientList[i].socket.emit('entityData', data);

		}
	});
})

//classes for clients and rooms
class Client {
	constructor(id, socket){
		this.socket = socket;
		this.id = id;
	}
}

class Player extends Client{
	constructor(socket, engine, position, size){
		super(Math.random().toString(), socket);
		this.position = position;
		this.engine = engine;
		this.afkExcempt = false; //if this is true the player can't be kicked for idle
		this.name = "";
		this.spamAttempts = 0; //how many messages in a row have been sent too fast
		this.lastMessage = {
			text: "",
			time: new Date().getTime()
		};
		this.size = size;
		this.lastMoveTime = new Date().getTime();
		this.unAFK = ()=>{ //called whenever player proves they aren't AFK
			this.lastMoveTime = new Date().getTime();
		}
		this.charController = new CharController(this, engine);
		this.start = ()=>{
			this.unAFK();
			this.socket.on('moveRequest', (data)=>{
				this.unAFK();
				this.charController.setKeysDown(data);
			})

			this.socket.on('chat', (data)=>{
				this.unAFK();
				emitChat(this, data.message);
			})

			this.socket.on('doorRequest', (data)=>{
				this.unAFK();
				checkDoors(this);
			})

		}
		this.getAFKTime = ()=>{ //checks how long player has been afk
			return new Date().getTime() - this.lastMoveTime;
		}
		this.setName = (name)=>{
			this.name = name;
		}
		this.setIP = (ip)=>{
			this.ip = ip;
		}
		this.setLastMessage = (text, time)=>{
			this.lastMessage = {
				text: text,
				time: time
			}
		}
		this.end = ()=>{
			this.charController.end();
		}
		this.kick = (reason)=>{
			this.socket.emit("kick", {
				reason: reason
			});
			this.socket.disconnect();
			this.end();
			aydabConsole.log(`${chalk.green("SUCCESS")}: player ${chalk.cyan(this.name)} has been kicked @ ip: ${chalk.cyan(this.ip)}`)
			delete this;
		}
	}
}


//player request handlers
const checkDoors = (player)=>{ //handles requests to go thru door
	let currentRoom = roomLoader.getRoom(player.room);
	for(let i in currentRoom.doors){
		let currDoor = currentRoom.doors[i];
		let doorPos = vectorIfy(currDoor.position);
		let doorSize = parseInt(currDoor.size);
		let distanceToDoor = new Vector2(player.position.x - doorPos.x, player.position.y - doorPos.y);
		if(distanceToDoor.x <= currDoor.size && distanceToDoor.y <= currDoor.size){
			emitRoomExit(player, currentRoom.name, clientList);
			player.room = currDoor.destination;
			emitRoom(player);
			emitConnection(player, clientList);
			player.position = vectorIfy(roomLoader.getRoom(player.room).startPos);
		}
	}
}

//helper functions for server
const emitConnection = (player, clients)=>{
	for(let i in clients){
		if(clients[i].room == player.room){
			clients[i].socket.emit('playerConnect', {id: player.id, position: player.position, name: player.name});
		}
	}
}

const emitDisconnection = (player, clients)=>{
	for(let i in clients){
		clients[i].socket.emit('playerDisconnect', {id: player.id});
	}
}

const emitRoomExit = (player, lastRoom, clients)=>{
	for(let i in clients){
		if(clients[i].room == lastRoom){
			clients[i].socket.emit('playerLeftRoom', {id: player.id});
		}
	}
}

const emitRoom = (player)=>{
	let room = roomLoader.getRoom(player.room);
	if(room != null){
		player.socket.emit('roomChange', {
			name : player.room,
			background : room.background,
			id: room.id,
			doors: room.doors,
			entities: getEntityList(player.room)
		})
		aydabConsole.log(`${chalk.cyan(player.name)} has entered room: "${player.room}"`)
	}
}

const emitChat = (player, message)=>{
	let newChat = chatFilter.filter(player, message); //puts chat thru filter
	if(newChat != false){ //only sends chat if filter allows
		aydabConsole.log(`[${getTimeStamp()}] ${chalk.cyan(player.name)} : '${newChat}'`)
		for(let i in clientList){
			let c = clientList[i]
			if(c.room == player.room){
				c.socket.emit('chat', {
					message : newChat,
					id : player.id
				})
			}
		}
	}
}

const emitPlayerSetup = (player, players)=>{
	let data = {entities : {}, player : {}};
	for(let i in players){
		if(players[i] != player){
			data.entities[i] = {name : players[i].name, id: i, position: [players[i].position.x, players[i].position.y]};
		}
	}
	data.player = {name: player.name, id: player.id, position: [player.position.x, player.position.y]}

	player.socket.emit('playerSetup', data);
}

//misc functions

const getEntityList = (roomName)=>{
	let data = [];
	for(let i in playerList){
		if(playerList[i].room == roomName){
			data.push({
				name : playerList[i].name, id: i, position: playerList[i].position
			})
		}
	}
	return data;
}

const stringToCords = (s)=>{
	let cords = s.split(', ');
	return new Vector2(cords[0], cords[1]);
}

const getStartCords = (roomName)=>{
	return vectorIfy(roomLoader.getRoom(roomName).startPos)
}

const vectorIfy = (list)=>{
	let newList = list.map(i=>parseInt(i));
	return new Vector2(newList[0], newList[1])
}

const getTimeStamp = ()=>{
	let date = new Date();
	return `${date.getFullYear()}:${date.getMonth()+1}:${date.getDate()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}