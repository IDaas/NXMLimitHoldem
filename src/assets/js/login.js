
const ipc = require('electron').ipcRenderer;

window.$ = window.jQuery = require('jquery')


var btn = $("#js-login-btn")
 

btn.click((e)=>{
    e.preventDefault()
    var data = {
        username : $('#username').val(),
        password : $('#password').val()

    }
    console.log("loged")
    ipc.send('login',data)	//envoie les identifiants
})

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
