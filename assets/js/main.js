

/*Window control*/ 
const remote = require('electron').remote
const elWindow = remote.getCurrentWindow()
$('#minimize').click(() => elWindow.minimize())
$('#maximize').click(() => {
  if (process.platform != "darwin") {
	elWindow.isMaximized() ? elWindow.unmaximize() : elWindow.maximize()
  } else {
	elWindow.isFullScreen() ? elWindow.setFullScreen(false) : elWindow.setFullScreen(true)
  }
})
$('#close').click(() => elWindow.close())
/*End window control*/

	
	
	
	
	
	
	
	
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
					playBtn.off()//supression des listeners
					playBtn.click((e)=>{
						ipc.send('new-game',app.selectedserver)	//envoie de la config du serveur au process principal
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

	})


//reqiore ipc to send messagee to main engine to greate a new game
const ipc = require('electron').ipcRenderer;
	
	