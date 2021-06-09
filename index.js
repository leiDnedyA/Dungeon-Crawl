const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = new socket.Server(server)
const CharController = require('./backend_character_controller.js')

//config variables
const port = 80;
var playerSpeed = 7;

//player and client lists
var clientList = {}
var playerList = {}

//express server setup
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules'));  

//socket server setup
io.on('connection', (socket)=>{
	console.log('user connected');
	let player = new Player(socket, new Vector2(0, 0));
	clientList[player.id] = player;
	playerList[player.id] = player;
	player.start();
	socket.on('disconnect', ()=>{
		console.log('user disconnected');
		delete playerList[player.id];
		delete clientList[player.id];
	});
})


//http server setup
server.listen(port, ()=>{
	console.log(`Server started on port ${port}`);
})


//classes for clients and rooms
class Client {
	constructor(id, socket){
		this.socket = socket;
		this.id = id;
	}
}

class Player extends Client{
	constructor(socket, position){
		super(Math.random().toString(), socket);
		this.position = position;
		this.charController = new CharController(this);
		this.start = ()=>{
			this.socket.on('moveRequest', (data)=>{
				this.charController.movePlayer(data);
			})
		}
	}
}

class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}