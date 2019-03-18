



    var app = new Vue({
    	el: '#app',
    	data: {
				user:"NIXML",
				messages: [],
				tablefields: [
					{name: "Start",field: "Start",},
					{name: "Name",field: "Name",},
					{name: "Owner",field: "Owner",},
					{name: "Game Mode",field: "GameMode",},
					{name: "Price",field: "Price",},
					{name: "Dotation",field: "Dotation",},
					{name: "Players",field: "Players",},
					{name: "Status",field: "Status",},
				],
				picked:'Start',
				selectedserver:'',

    		servers: [{
    				Start: "10h30",
						Name: "MTT 1",
						Owner:'NIXML',
    				GameMode: "NLHE",
    				Price: "5",
    				Dotation: "2",
    				Players: "20",
    				Status: "Open"
					},
					{
    				Start: "11h30",
						Name: "MTT 2",
						Owner:'NIXML',
    				GameMode: "NLHE",
    				Price: "1",
    				Dotation: "4",
    				Players: "150",
    				Status: "Close"
					},
					{
    				Start: "09h30",
						Name: "MTT 3",
						Owner:'NIXML',
    				GameMode: "NLHE",
    				Price: "100",
    				Dotation: "50",
    				Players: "10",
    				Status: "Close"
					}
    		]
			},
			methods:{
				dynamicSort: function (property) {
					var sortOrder = 1;
					return function (a, b) {
						if (Number.isInteger(+a[property])) {
							var result = a[property] - b[property];
						} else {
							var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
						}
						return result * sortOrder;
					}
				},

				selectserver:function(server){
					this.selectedserver=server;
					
				}




			},

			computed:{
				sortedServers :function(){
					return this.servers.sort(this.dynamicSort(this.picked));
				}



			},





    	created: function () {
				
        },
        updated:function() {
					$('.tabs').tabs({
						swipeable: true,
						
					});
        },
    })








  //handling messages
  var socket = io('http://10.167.129.134:3000');
  $(function () {
      $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', app.user+": "+$('#msgtextarea').val());
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


