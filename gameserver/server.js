var config = require("./properties.json")  //load config


var app = require("express")();            //require express webserver
var http = require("http").Server(app);  //serving http
//var io = require("socket.io")(http);




//Part to connect to main server
var port = config.port;
var tomainserver = require("socket.io-client")(config.mainaddress+":"+config.mainport+'/server')
tomainserver.emit('info',config)







// http.listen(port, function() {
// 	console.log("listening on *:" + port);
// });
// app.get("/", function(req, res) {
// 	res.sendFile(__dirname + "/index.html");
// });



