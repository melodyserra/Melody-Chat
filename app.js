var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set("view engine", "ejs");

app.use(express.static("assets"));

app.get("/", function(req, res) {
	res.render("index");
});

io.on('connection', function(socket) {
	socket.on('chat', function(chatInfo) {
		socket.broadcast.emit('chat', chatInfo);
	});
});

http.listen(3000);