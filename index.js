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

//config variables
const frameRate = 30;
const port = 80;
const engine = new Engine(frameRate);
const chatFilter = new ChatFilter();
const roomLoader = new RoomLoader(levelJSON);
engine.start();
engine.roomLoader = roomLoader;

//player and client lists
var clientList = {}
var playerList = {}

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
	let player = new Player(socket, engine, getStartCords(startRoom), new Vector2(40, 40)/*Eventually this is gonna have to get synced with server*/); 
	// console.log(player.position)
	player.ip = socket.handshake.address;
	clientList[player.id] = player;
	playerList[player.id] = player;
	player.room = startRoom;

	// player.position = new Vector2()
	player.start();
	
	if(!banList.hasOwnProperty(String(player.ip))){
		socket.on('start', (data)=>{
			player.name = data.name;		
			aydabConsole.log(`[${getTimeStamp()}] : ${data.name} has joined the world (IP: ${player.ip})`)
			emitConnection(player, clientList);
			emitPlayerSetup(player, playerList);
			emitRoom(player);

		})
	}else{
		socket.disconnect();
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
		this.size = size;
		this.charController = new CharController(this, engine);
		this.start = ()=>{
			this.socket.on('moveRequest', (data)=>{
				this.charController.setKeysDown(data);
			})

			this.socket.on('chat', (data)=>{
				emitChat(this, data.message);
			})

			this.socket.on('doorRequest', (data)=>{
				checkDoors(this);
			})

		}
		this.end = ()=>{
			this.charController.end();
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
	if(chatFilter.filter(player, message)){
		aydabConsole.log(`[${getTimeStamp()}] ${chalk.cyan(player.name)} : '${message}'`)
		for(let i in clientList){
			let c = clientList[i]
			if(c.room == player.room){
				c.socket.emit('chat', {
					message : message,
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