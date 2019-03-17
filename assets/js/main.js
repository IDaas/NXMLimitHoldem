



    var app = new Vue({
    	el: '#app',
    	data: {
    		messages: [],
    		servers: [{
    				Start: "10h30",
    				Name: "MTT 1",
    				GameMode: "NLHE",
    				Price: "5€",
    				Dotation: "2€",
    				Players: "20",
    				Status: "Open"
    			},
    			{
    				Start: "11h00",
    				Name: "MTT 2",
    				GameMode: "NLHE",
    				Price: "5€",
    				Dotation: "2€",
    				Players: "20",
    				Status: "Open"
    			},
    			{
    				Start: "11h30",
    				Name: "MTT 3",
    				GameMode: "NLHE",
    				Price: "5€",
    				Dotation: "2€",
    				Players: "20",
    				Status: "Open"
    			},
    			{
    				Start: "12h30",
    				Name: "MTT 4",
    				GameMode: "NLHE",
    				Price: "5€",
    				Dotation: "2€",
    				Players: "20",
    				Status: "Open"
    			}


    		]
    	},
    	created: function () {
    	
        },
        mounted:function() {
            // table.clear();
           
        },
    })








  //handling messages
  var socket = io('http://localhost:3000');
  $(function () {
      $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#msgtextarea').val());
        $('#msgtextarea').val('');
        return false;
      });
      socket.on('chat message', function(msg){
        app.messages.push(msg);
        if(app.messages.length > 40){
            app.messages.shift()
        }
        

        $('.chatmessages').scrollTop($('.chatmessages').get(0).scrollHeight);
        //$('.chatmessages').scrollTop = $('.chatmessages').scrollHeight;
      });
    });


