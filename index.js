const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = new socket.Server(server)

//config variables
const port = 80;

//express server setup
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules'));  

//socket server setup
io.on('connection', (socket)=>{
	console.log('user connected');
	socket.on('disconnect', ()=>{
		console.log('user disconnected');
	})
})

//http server setup
server.listen(port, ()=>{
	console.log(`Server started on port ${port}`);
})