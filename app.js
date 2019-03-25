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

function createLoginWindow(parent){
	const win = new electron.BrowserWindow({ 
		parent: parent, 
		width: 400, 
		height: 800,
		minWidth:400,
		maxWidth:400,
		maxHeight:800,
		minHeight:800,
		frame:false
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
// init window
app.on('ready', () => {
	mainWindow = createMainWindow();
	loginWindow = createLoginWindow(mainWindow);

	loginWindow.on('close',()=>{
		app.quit()
	})

});





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
	gamewindow.on('close',()=>{
		games = games.filter(game=> game.key!=data.key)
	})


	games.push(Object.assign(gamewindow,data));
	console.log("nombres de parties :"+ games.length)
	


})

// login part
ipc.on('login',(event,data)=>{
		console.log(data)
		//call function checkConnection with callback
		checkConnection(data.username,data.password,(response)=>{
			if(response){		
				mainWindow.show()
				loginWindow.hide()
			}
		})

})

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

//Pseudo true or false asnc way to fix this shit
function checkConnection(username,password,callback){
	let sql = `SELECT count(*) as count from users where username= "${username}" AND password = md5(${password})`
	db.query(sql,(err,result)=>{
		if (err) {
			console.log(err)
		}
		callback(result[0].count >= 1? true:false)
	})



}







