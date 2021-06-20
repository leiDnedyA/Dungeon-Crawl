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
	
	socket.on('start', (data)=>{
		player.name = data.name;		
		console.log(`${data.name} has joined the world (IP: ${player.ip})`)
		emitConnection(player, clientList);
		emitPlayerSetup(player, playerList);
		emitRoom(player);

	})

	// console.log(clientList);

	socket.on('disconnect', ()=>{
		console.log(`user ${player.name} disconnected at IP: ${socket.handshake.address}`);
		playerList[player.id].end();
		delete playerList[player.id];
		delete clientList[player.id];
		
		emitDisconnection(player, clientList);

	});


})


//http server setup
server.listen(port, ()=>{
	console.log(`Server started on port ${port}`);
	
	//function that updates all players
	engine.addUpdateFunc('MAIN', ()=>{
		let data = {};
		for(let j in playerList){
			data[j] = {
				'position' : [playerList[j].position.x, playerList[j].position.y],
				'id' : j
			}
		}
		for(let i in clientList){
			clientList[i].socket.emit('entityData', data)
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

		}
		this.end = ()=>{
			this.charController.end();
		}
	}
}


//helper functions for server
const emitConnection = (player, clients)=>{
	for(let i in clients){
		clients[i].socket.emit('playerConnect', {id: player.id, position: player.position, name: player.name});
	}
}

const emitDisconnection = (player, clients)=>{
	for(let i in clients){
		clients[i].socket.emit('playerDisconnect', {id: player.id});
	}
}

const emitRoom = (player)=>{
	let room = roomLoader.getRoom(player.room);
	if(room != null){
		player.socket.emit('roomChange', {
			name : player.room,
			background : room.background,
			id: room.id,
			doors: room.doors
		})
		console.log(`${player.name} has entered room: "${player.room}"`)
	}
}

const emitChat = (player, message)=>{
	if(chatFilter.filter(player, message)){
		console.log(`[CHAT] ${player.name} : '${message}'`)
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