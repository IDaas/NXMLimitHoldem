'use strict';
const electron = require('electron');
var path = require('path');

const app = electron.app;


// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;
let loginWindow;

function onClosed() {//free windows
	mainWindow = null;
	loginWindow = null;
	
}
//function to greate mainwindow
function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1000,
		height: 750,
		minWidth: 1250,
		minHeight: 750,
		icon:path.join(__dirname,'/image/NIXML.ico'),
		show: false,
		frame:false
		
	});
	win.loadURL(`file://${__dirname}/src/index.html`);
	win.on('closed', onClosed);

	return win;
}
//create main window function
function createLoginWindow(parent){
	const win = new electron.BrowserWindow({ 
		parent: parent, 
		width: 400, 
		height: 800,
		minWidth:400,
		maxWidth:400,
		maxHeight:800,
		minHeight:800,
		frame:false,
		name:'login'
	})
	win.loadURL(`file://${__dirname}/src/login.html`);
	win.on('closed', onClosed);
	
	return win;
}


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});
// init windows
app.on('ready', () => {
	mainWindow = createMainWindow();
	loginWindow = createLoginWindow(mainWindow);

	loginWindow.on('close',()=>{
		app.quit()
	})

});




//current player games lists
var games = [];



//on require icp main pour recevori la communication du renderer
var ipc = require('electron').ipcMain;
ipc.on('new-game',(event,data)=>{//on new game request
	
	//prevent to open multiple windows
	for (let i = 0; i < games.length; i++) {
		const game = games[i];
		
		if (game.key==data.key) {
			return
		}

	}
	//create a new game window  set name and marent
	var gamewindow = new electron.BrowserWindow({
		width:800,
		height:600,
		minWidth:400,
		minHeight:300,
		title:data.Name,
	})


	gamewindow.loadURL(`file://${__dirname}/game/game.html`);
	
	//for keeping aspect ratio
	gamewindow.on('resize', ()=> {
		setTimeout(()=>{
		  var size = gamewindow.getSize();
		  gamewindow.setSize(size[0], parseInt(size[0] * 9 / 16));
		}, 0);
	  });

	//remove games from player game list  
	gamewindow.on('close',()=>{
		games = games.filter(game=> game.key!=data.key)
	})

	//add game agame with gamewindow and server data
	games.push(Object.assign(gamewindow,data));
	console.log("nombres de parties :"+ games.length)
	


})

// login part



var loginsocket = require("socket.io-client")('http://localhost:3000/login');
//recieve a message from login renderer
ipc.on('login',(event,data)=>{
	//send it to mainserver
	loginsocket.emit('login',data);
})


//réponse du serveur pour la connection login mot de passe
loginsocket.on("login",(accept)=>{
	if(accept){  // if authorized
		mainWindow.show()
		loginWindow.hide()
	}else{ //send login event
		loginWindow.webContents.send("loginerror","")
		
		
	}
})





