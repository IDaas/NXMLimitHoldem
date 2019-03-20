var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
//list of servers
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




//partie chat    Main server to client
var chatsocket = io.of('/chat');


chatsocket.on("connection", function(socket) {
  socket.on("chat message", function(msg) {
    chatsocket.emit("chat message", msg);
		console.log(msg);
	});
});

chatsocket.on("connect", function(socket) {
  chatsocket.emit("chat message", "[Server] : Connected to  server");
});




//Partie mainserver to client   for the serverlist
var serversSocket = io.of('/servers');


serversSocket.on("connection", function(socket) {
	socket.on("requestupdate", function(msg) {
		serversSocket.emit("requestupdate", msg);
		console.log(msg);
	});
});

serversSocket.on("connect", function(socket) {
  serversSocket.emit("serverupdate", servers);
  console.log("Client conected")
});







//partie mainserver to other server
var servToServSocket = io.of('/server')

servToServSocket.on("connection", function(socket) {
	socket.on("info", function(msg) {
		
		console.log(msg);
	});
});
//affiche quand un nouveau serveur se conecte au main server
servToServSocket.on("connect", function(socket) {
  console.log("New game server found")
  //console.log(socket)
});

