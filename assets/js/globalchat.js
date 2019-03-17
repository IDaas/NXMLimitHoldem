

    var socket = io('http://localhost:3000');
    
  


$(function () {
    $('form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      socket.emit('chat message', $('#msgtextarea').val());
      $('#msgtextarea').val('');
      return false;
    });

    socket.on('chat message', function(msg){
      $('#messages').append($('<li>').text(msg));





      
      $('.chatmessages').scrollTop($('.chatmessages').get(0).scrollHeight);
    });
  });