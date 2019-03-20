var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

var servers = [
	{
		Start: "10h30",
		Name: "MTT 1",
		Owner: "NIXML",
		GameMode: "NLHE",
		Price: "5",
		Dotation: "2",
		Players: "20",
		Status: "Open"
	},
	{
		Start: "11h30",
		Name: "MTT 2",
		Owner: "NIXML",
		GameMode: "NLHE",
		Price: "1",
		Dotation: "4",
		Players: "150",
		Status: "Close"
	},
	{
		Start: "09h30",
		Name: "MTT 3",
		Owner: "NIXML",
		GameMode: "NLHE",
		Price: "100",
		Dotation: "50",
		Players: "10",
		Status: "Close"
	}
];




http.listen(port, function() {
	console.log("listening on *:" + port);
});
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});




//partie chat
var chatsocket = io.of('/chat');
//partie chat

chatsocket.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    chatsocket.emit("chat message", msg);
		console.log(msg);
	});
});

chatsocket.on("connect", function(socket) {
  chatsocket.emit("chat message", "[Server] : Connected to  server");
});

//Partie mainserver to client
var serversocket = io.of('/servers');


serversocket.on("connection", function(socket) {
	socket.on("requestupdate", function(msg) {
		serversocket.emit("requestupdate", msg);
		console.log(msg);
	});
});

serversocket.on("connect", function(socket) {
  serversocket.emit("serverupdate", servers);
  console.log("Client conected")
});