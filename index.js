const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = new socket.Server(server)
const CharController = require('./js/backend_character_controller.js')
const Engine = require('./js/engine.js')

//config variables
const frameRate = 20;
const port = 80;
const engine = new Engine(frameRate);
engine.start();

//player and client lists
var clientList = {}
var playerList = {}

//express server setup
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules'));  

//socket server setup
io.on('connection', (socket)=>{
	console.log(`user connected at IP: ${socket.handshake.address}`);
	let player = new Player(socket, engine, new Vector2(0, 0));
	clientList[player.id] = player;
	playerList[player.id] = player;
	player.start();
	
	emitConnection(player, clientList);
	emitPlayerSetup(player, playerList);

	// console.log(clientList);

	socket.on('disconnect', ()=>{
		console.log(`user disconnected at IP: ${socket.handshake.address}`);
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
	constructor(socket, engine, position){
		super(Math.random().toString(), socket);
		this.position = position;
		this.engine = engine;
		this.charController = new CharController(this, engine);
		this.start = ()=>{
			this.socket.on('moveRequest', (data)=>{
				this.charController.setKeysDown(data);
			})
		}
		this.end = ()=>{
			this.charController.end();
		}
	}
}

class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

//helper functions for server
const emitConnection = (player, clients)=>{
	for(let i in clients){
		clients[i].socket.emit('playerConnect', {id: player.id, position: player.position});
	}
}

const emitDisconnection = (player, clients)=>{
	for(let i in clients){
		clients[i].socket.emit('playerDisconnect', {id: player.id});
	}
}

const emitPlayerSetup = (player, players)=>{
	let data = {entities : {}, player : {}};
	for(let i in players){
		if(players[i] != player){
			data.entities[i] = {id: i, position: [players[i].position.x, players[i].position.y]};
		}
	}
	data.player = {id: player.id, position: [player.position.x, player.position.y]}

	player.socket.emit('playerSetup', data);
}