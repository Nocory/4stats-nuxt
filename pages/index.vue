<template>
  <div id="app">
    <Component-nav/>
    <div class="main">
      <no-ssr>
        <h6 class="connected is-hidden-touch">
          just updated: /{{ recentlyUpdatedBoard }}/<br>
          users on site: {{ connectedUsers }}
        </h6>
      </no-ssr>
      <div class="container is-fullhd">
        <div class="columns">
          <component-boardlist class="column is-12-mobile is-6-tablet"/>
          <component-threadlist class="column is-12-mobile is-6-tablet"/>
        </div>
      </div>
    </div>
		
    <no-ssr>
      <div class="section has-text-centered is-hidden-mobile">
        <component-chart class="container" v-if="renderChart || forceChart"/>
        <button v-else @click="forceChart = true" class="button">
          Force-Load Chart Module<br>
          not reccommended on mobile
        </button>
      </div>
    </no-ssr>

    <component-footer/>
  </div>
</template>

<script>
/*
import config from "~/assets/js/config.js"
const axios = require("axios")
*/
import pino from "~/assets/js/pino.js"
export default {
	data: () => ({
		forceChart: false,
		renderChart: process.browser ? window.innerWidth >= 1216 : false, // the bulma breakpoint for desktops
		recentlyUpdatedBoard: "",
		connectedUsers: 0
	}),
	components: {
		ComponentNav: require("~/components/nav.vue").default,
		ComponentBoardlist: require("~/components/boardlist.vue").default,
		ComponentThreadlist: require("~/components/threadlist.vue").default,
		ComponentChart: require('~/components/chart.vue').default, // FIXME: lazy loading for relevant screen-width
		ComponentFooter: require("~/components/footer.vue").default,
	},
	beforeRouteUpdate (to, from, next) {
		if(Object.keys(to.query).length){
			if(to.query.board) this.$store.dispatch("boardClicked",to.query.board)
			if(to.query.sortBy) this.$store.commit("setSortBy",to.query.sortBy)
			next("/")
		}else{
			next()
		}
	},
	created(){
		if(process.browser){
			this.$socket.on("allBoardStats",allBoardStats => {
				pino.debug("Received allBoardStats from API")
				this.$store.commit("setInitialData",allBoardStats)
			})

			this.$socket.on("boardUpdate",(board,data) => {
				this.recentlyUpdatedBoard = board

				this.$store.commit("updateBoardData",{
					board,
					data
				})

				if(this.$store.state.selectedBoard == board){
					setTimeout(this.$store.dispatch,Math.random() * 2000,"getActiveThreads",board) //stagger automatic thread requests coming from different clients
				}else if(this.$store.state.threadData[board].length){
					this.$store.commit("updateThreadData",{
						board,
						threads: []
					})
				}
			})

			this.$socket.on("userCount",userCount => {
				this.connectedUsers = userCount
			})
		}
	},
	mounted(){
		if(process.browser){
			window.addEventListener("resize",() => {
				this.renderChart = window.innerWidth >= 1216
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import "~assets/css/variables.scss";

#app {
	overflow: hidden;
  z-index: 0;
  position: relative;
  min-height: 100vh;
	background: $--color-background;
	font-family: monospace;
	@include mobile{
		touch-action: pan-y;
	}
}

.main{
	position: relative;
	@include desktop{
		padding-top: 1rem;
	}
	@include touch{
		padding-top: 0rem;
	}
}

.connected {
	position: absolute;
	top: 4px;
	left: 4px;
  font-size: 10px;
  color: $oc-gray-4;
	opacity: 1;
	&:hover{
		opacity: 1;
	}
	&:after{
		position: absolute;
		left: 0;
		top: 200%;
		//content: "works now?";
	}
}

.header{
	position: relative;
	display: flex;
	justify-content: space-between;
}

.columns{
	position: relative;
	@include touch{
		margin: 0;
	}
	@include desktop{
		margin: 0 -0.5rem;
	}
}

.column{
	@include touch{
		padding: 0rem;
	}
	@include desktop{
		padding: 0 0.5rem;
	}
}
</style>