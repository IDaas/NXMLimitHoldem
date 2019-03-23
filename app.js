'use strict';
const electron = require('electron');
var path = require('path');

const app = electron.app;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1000,
		height: 750,
		minWidth: 1250,
		minHeight: 750,
		icon:path.join(__dirname,'/image/NIXML.ico'),
		frame: false
	});

	
	win.loadURL(`file://${__dirname}/index.html`);
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

app.on('ready', () => {
	mainWindow = createMainWindow();
});





var games = [];



//on require icp main pour recevori la communication du renderer
var ipc = require('electron').ipcMain;
ipc.on('new-game',(event,data)=>{//on new game request
	var gamewindow = new electron.BrowserWindow({
		width:800,
		height:600,
		minWidth:400,
		minHeight:300,
		title:data.Name,
		

	})
	gamewindow.loadURL(`file://${__dirname}/game/game.html`);
	 games.push(gamewindow);
	console.log(games.length)
	console.log(data)


})
