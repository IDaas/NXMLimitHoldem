



    var app = new Vue({
    	el: '#app',
    	data: {
				user:"NIXML",
				messages: [],
				message:'',
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

    		servers: []
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
					
				},
				sendmessage:function(){
					if(this.message !=''){
						chatsocket.emit('chat message', app.user+": "+this.message);
						this.message=''
					}
				},




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
						swipeable: true});
					//D'claration du bouton de click pour join la game
					var playBtn = $("#js-play")
					playBtn.click((e)=>{
						console.log("Play Clicked")
						//alert(JSON.stringify(app.selectedserver))
						//window.open('game.html', '_blank', 'nodeIntegration=yes')
						ipc.send('new-game',app.selectedserver)	
					})
						
        },
    })








  //handling messages
  var chatsocket = io('http://localhost:3000/chat');
  
		chatsocket.on('chat message', function(msg){
			app.messages.push(msg);
			if(app.messages.length > 40){
				app.messages.shift()
					}
					console.log(msg)
			$('.chatmessages').scrollTop($('.chatmessages').get(0).scrollHeight);
		});
			
//Server list update
var serversocket = io('http://localhost:3000/servers');

	serversocket.on('serverupdate',function(serverlist){
		app.servers = serverlist
		//console.log(serverlist)
	})
    const ipc = require('electron').ipcRenderer;
	
	