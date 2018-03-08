import socketIO from 'socket.io-client'
import config from '~/assets/js/config'
import pino from '~/assets/js/pino'

let socket = socketIO(config.url,{
	transports: window.WebSocket ? ['websocket'] : ['polling', 'websocket'],
	reconnectionDelay: 4000,
	query: {
		connectionType: localStorage.getItem("selectedBoard") ? 'revisit' : "new",
		dontSendBoards: true
	}
})

let enforcedClientVersion = null
socket.on("enforcedClientVersion", data => {
	if (enforcedClientVersion != data) pino.info("enforcedClientVersion is: %d", data)
	enforcedClientVersion = enforcedClientVersion || data	
	if (enforcedClientVersion != data) {
		pino.info("reloading")
		window.location.reload(true)
	}
})

socket.on('disconnect', reason => {
	pino.debug("Socket disconnected. Reason: %s",reason)
})

socket.on("reconnect",() => {
	pino.debug("Socket re-connected")
})

socket.on("connect",() => {
	pino.debug("Socket connected")
	socket.io.opts.query = {
		connectionType: 'foreground',
		dontSendBoards: false
	}
})

let openTimerID = null
let closeTimerID = null
let isSocketOpen = true // maybe not needed, but lets be sure

const handleVisibilityChange = () => {
	if(document.hidden){
		clearTimeout(openTimerID)
		clearTimeout(closeTimerID)
		if(isSocketOpen){
			closeTimerID = setTimeout(() => {
				isSocketOpen = false
				socket.close()
			},30000)
		}
	}else{
		clearTimeout(openTimerID)
		clearTimeout(closeTimerID)
		if(!isSocketOpen){
			openTimerID = setTimeout(() => {
				isSocketOpen = true
				socket.open()
			},500)
		}
	}
}

if(document.hidden) handleVisibilityChange()

document.addEventListener("visibilitychange", handleVisibilityChange, false)

import Vue from 'vue'

const plugin = {
	install: Vue => {
		Vue.prototype.$socket = socket
	}
}
Vue.use(plugin)