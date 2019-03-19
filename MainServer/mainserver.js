var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log(msg);
  });
});

io.on('connect', function(socket){
  io.emit('chat message', "[Server] : Connected to  server");
 
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});