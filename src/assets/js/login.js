
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