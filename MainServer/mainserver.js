//initiolisation


var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;
//list of servers
var servers = []



//listen for html page
http.listen(port, function() {
	console.log("listening on *:" + port);
});
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});





//conection to database
const mysql = require('mysql')
const dbconfig = require("./database/dbconfig")
//call dbconfig
const db = mysql.createConnection(dbconfig)
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});












//partie chat    Main server to client
var chatsocket = io.of('/chat');

//ecoute sur la connection
chatsocket.on("connection", function(socket) {
	//sur un chatsocket
  socket.on("chat message", function(msg) {
    chatsocket.emit("chat message", msg);
		console.log(msg);
	});
});
//Message de bienvenue
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

//send the list of servers when client connect
serversSocket.on("connect", function(socket) {
  serversSocket.emit("serverupdate", servers);
  console.log("Client conected")
});







//partie mainserver to other server
var servToServSocket = io.of('/server')

servToServSocket.on("connection", function(socket) {
	
	//on new game server  server
	socket.on("info", function(config) {
		//add new server to the list
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

	//when a server shuts down or disconnect
	socket.on("disconnect",function(){
		//debug console.log("disconected")
	   for (let i = 0; i < servers.length; i++) { //for all servers
		   if(servers[i].key== socket.id){  //if server in the array
			   servers.splice(i,1)            //delete it
			   //debug console.log("deleted server")
			 }
			 //send the new serverlist to the client
		   serversSocket.emit('serverupdate',servers)
		   // debug console.log(servers)
	   }
	})
	
	







});
//affiche quand un nouveau serveur se conecte au main server
servToServSocket.on("connect", function(socket) {
  console.log("New game server found")
  //console.log(socket)
});


var login = io.of('/login')

	
login.on("connection", function(socket) {
	
		//event quend le client demande a se connecter
		socket.on("login", function(data) {
			checkConnection(data.username,data.password,(accepted)=>{
				//on revoie la réponse 
				login.emit("login",accepted)
				//debug console.log("Accepted : "+ accepted)
			})
		})
			
})







//Pseudo true or false asnc way to fix this shit
function checkConnection(username,password,callback){
	let sql = `SELECT count(*) as count from users where username= ? AND password = md5(?)`
	db.query({sql:sql ,values: [username,password]  } ,(err,result)=>{
		if (err) {
			console.log(err)
		}
		console.log(result[0].count)
		callback(result[0].count >= 1? true:false)
	})

}
