var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
//list of servers
var servers = []




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
	
	//on new server
	socket.on("info", function(config) {
		servers.push(
		{
			key:socket.id,
			Start: config.Start,
			Name: config.Name,
			Owner: config.Token,
			GameMode: config.GameMode,
			Price: config.BuyIn,
			Dotation: config.Dotation,
			Players: config.MaxPlayers,
			Status: config.Status
		})
		serversSocket.emit('serverupdate',servers)
		console.log(servers);
	});

	

	







});
//affiche quand un nouveau serveur se conecte au main server
servToServSocket.on("connect", function(socket) {
  console.log("New game server found")
  //console.log(socket)
});


servToServSocket.on("disconnect",function(){
	console.log("disconected")
   for (let i = 0; i < servers.length; i++) {
   	if(servers[i].key== socket.id){
   		servers.splice(i,1)
   		console.log("deleted server")
   		break;
   	}
   	serversSocket.emit('serverupdate',servers)
   }
})



var interval  = setInterval(() => {
	console.log(serversSocket.server.clients())
}, 5000);


