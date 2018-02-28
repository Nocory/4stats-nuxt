import Vuex from 'vuex'

const adjustActivityIfFewPosts = data =>{
	if(data.avgPostsPerDay < 1000) data.relativeActivity -= 9999
	return data
}
import config from "~/assets/js/config.js"
import pino from "~/assets/js/pino.js"
import axios from "axios"

const createStore = () => {
	const store = new Vuex.Store({
		//strict: process.env.NODE_ENV !== 'production',
		state: {
			enabledBoards: config.allBoards,
			selectedBoard: "g",
			boardData: {}, //technology
			sortedBoards: [],
			threadData: config.allBoards.reduce((obj,key) => ({...obj, [key]: []}),{}),
			sortBoardListBy: "avgPostsPerDay"
		},
		getters: {
			combinedBoardStats : state => {
				let combinedStats = {
					postsPerMinute: 0,
					avgPostsPerDay: 0
				}
				for(let board in state.boardData){
					combinedStats.postsPerMinute += state.boardData[board].postsPerMinute
					combinedStats.avgPostsPerDay += state.boardData[board].avgPostsPerDay
				}
				return combinedStats
			}
		},
		mutations: {
			setEnabledBoards(state, payload) {
				state.enabledBoards = payload
				localStorage.setItem("enabledBoards",JSON.stringify(payload))
			},
			setInitialData(state,payload){
				for(let key in payload){
					adjustActivityIfFewPosts(payload[key])
				}
				this._vm.$set(state, 'boardData', payload)
			},
			updateBoardData(state,payload){
				adjustActivityIfFewPosts(payload.data)
				
				if(state.boardData[payload.board]){
					for(let key in payload.data){
						state.boardData[payload.board][key] = payload.data[key]
					}
				}else{
					this._vm.set(state.boardData, payload.board, payload.data)
					pino.warn(`${payload.board} missing from list. Adding it now. This shouldn't happen really.`)
				}
			},
			updateThreadData(state,payload){
				for(let thread of payload.threads){
					thread.com = thread.com.replace(
						/&gt;.*?($|<br>)/gim,
						"<span class='greentext'>$&</span>"
					)
				}
				state.threadData[payload.board] = payload.threads
			},
			setSelectedBoard(state, payload) {
				state.selectedBoard = payload
				if(process.browser){
					localStorage.setItem("selectedBoard",payload)	
					document.cookie = `selectedBoard=${payload}`
				}
			},
			setSortBy(state, payload) {
				state.sortBoardListBy = payload
				if(process.browser){
					localStorage.setItem("sortBoardListBy",payload)
					document.cookie = `sortBoardListBy=${payload}`
				}
			},
			clearThreads(state){
				for(let board in state.threadData){
					if(state.threadData[board].length && board != state.selectedBoard){
						state.threadData[board] = []
					}
				}
			}
		},
		actions: {
			getActiveThreads(context,board = context.state.selectedBoard){
				pino.debug("Requesting /activeThreads /%s/ from API",board)
				return axios.get(config.url + `/activeThreads/${board}`)
					.then(function (response) {
						context.commit("updateThreadData",{
							board,
							threads: response.data
						})
					})
					.catch(function (error) {
						pino.error(error)
					})
			},
			boardClicked(context,board = context.state.selectedBoard) {
				context.commit("setSelectedBoard",board)
				// dont request if threads are already current
				if(context.state.threadData[board].length == 0){
					return context.dispatch("getActiveThreads",board)
				}
			},
			nuxtServerInit (storeContext,nuxtContext) {
				const cookie = require('cookie')

				let cookies = cookie.parse(nuxtContext.req.headers.cookie || "")
				
				//console.log(cookies)

				if(!config.allBoards.includes(nuxtContext.query.board)){
					nuxtContext.query.board = null
				}
				if(!config.allBoards.includes(cookies.selectedBoard)){
					cookies.selectedBoard = null
				}

				const setCookies = []
				if(nuxtContext.query.board){
					setCookies.push(cookie.serialize('selectedBoard', nuxtContext.query.board, {
						maxAge: 60 * 60 * 24 * 365 * 1
					}))
				}
				if(nuxtContext.query.sortBy){
					setCookies.push(cookie.serialize('sortBoardListBy', nuxtContext.query.sortBy, {
						maxAge: 60 * 60 * 24 * 365 * 2
					}))
				}
				nuxtContext.res.setHeader('Set-Cookie', setCookies)
				
				const promises = []
				
				storeContext.commit("setSortBy",nuxtContext.query.sortBy || cookies.sortBoardListBy || "avgPostsPerDay")

				promises.push(storeContext.dispatch("boardClicked",nuxtContext.query.board || cookies.selectedBoard || config.safeInitialBoard[Math.floor(Math.random() * config.safeInitialBoard.length)]))

				promises.push(axios.get(config.url + '/allBoardStats')
					.then(function (response) {
						storeContext.commit("setInitialData",response.data)
					})
					.catch(function (error) {
						pino.error(error)
					}))

				return Promise.all(promises)
			}
		}
	})
	
	return store
}

export default createStore