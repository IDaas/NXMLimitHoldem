'use strict';
const electron = require('electron');

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
		webPreferences: {
			nativeWindowOpen: true
		  }
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


var gamewindow = null;

app.on('ready',()=>{


	 gamewindow = new electron.BrowserWindow({
		width:300,
		height:300,
		show:false
	})

})



var ipc = require('electron').ipcMain;


ipc.on('new-game',()=>{
	console.log('salut')
	gamewindow.show()
})
