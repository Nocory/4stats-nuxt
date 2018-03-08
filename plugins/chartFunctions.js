window.moment = require('moment/min/moment.min.js')

const Chart = require('chart.js/dist/Chart.js')
Chart.defaults.global.defaultFontFamily = 'monospace'
Chart.defaults.global.defaultFontSize = 14
const store = require("~/store/index").default



let chart = null

let availableColors = [
	"#212529", // gray 9
	"#ff6b6b", //RED 5
	"#3bc9db", //CYAN 4
	"#a9e34b", //lime 4
	"#ffd43b", //yellow 4
	"#dee2e6", // gray 3
	"#38d9a9", //teal 4
	"#ffa94d", //orange 4
]

const init = id => {
	chart = new Chart(id, {
		type: 'line',
		data: {
			datasets: []
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			hover:{
				animationDuration: 500,
				mode: "nearest",
				axis: "xy"
			},
			legend: {
				labels: {
					fontColor: '#f8f9fa'
				}
			},
			tooltips: {
				caretPadding: 8,
				callbacks: {
					label: function(tooltipItem, data) {
						return `/${data.datasets[tooltipItem.datasetIndex].label}/ ${tooltipItem.yLabel.toFixed(2)}`
					},
					labelColor: function(tooltipItem) {
						return {
							borderColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
							backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor,
						}
					}
				}
			},
			elements: {
				line: {
					borderWidth: 2,
					fill: false,
					borderCapStyle: "round"
				},
				point: {
					radius: 0,
					hoverRadius: 4,
					hitRadius: 32
				}
			},
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						stepSize: 1,
						tooltipFormat: 'MMM Do, h:mma',
						displayFormats: {
							hour: 'hA',
							day: 'MMMD',
							week: 'MMMD',
						},
						isoWeekday: true
					},
					ticks: {
						fontColor: "rgba(255,255,255,0.75)"
					},
					gridLines: {
						color: "rgba(0,0,0,0.25)"
					},
				}],
				yAxes: [{
					ticks: {
						beginAtZero: true,
						fontColor: "rgba(255,255,255,0.75)"
					},
					gridLines: {
						color: "rgba(0,0,0,0.25)"
					},
				}]
			}
		}
	})
	return chart
}

let addBoard = (board, history, options, updateTime = 1000) => {
	chart.options.elements.line.stepped = options.term == "day"
	chart.options.scales.xAxes[0].time.unit = options.term == "day" ? "week" : {
		24: "hour",
		[24*7]: "day",
		[24*7*4]: "week"
	}[options.maxEntries.hour]
	
	let chartThis = history.slice(-options.maxEntries[options.term]) //TODO: replace slice with min value date
	if(options.term == "hour" && options.hourProperty == "activity"){
		//let topPPM = board == "combined" ? store.getters.combinedBoardStats.topPPM : store.state.boardData[board].topPPM
		//chartThis = chartThis.map(el => ({x: el.x, y: el.y * 100 / topPPM}))
		chartThis = chartThis.map(el => ({x: el.x, y: el.y * 100 / store.state.boardData[board].topPPM}))
	}
	
	if(options.term == "hour" && options.smoothingLevel){
		// I don't even remember how this exactly works
		// insanity
		let maxVariance = chartThis.reduce((totalY, entry) => totalY + entry.y, 0) / chartThis.length
		maxVariance *= 0.01 + 0.01 / options.smoothingLevel //TODO: find best values
		for (let i = 0; i < options.smoothingLevel; i++) {
			let smoothedHistory = []
			for (let i = 0; i < chartThis.length; i++) {
				if (i == 0 || i == chartThis.length - 1) {
					smoothedHistory.push({
						x: chartThis[i].x,
						y: chartThis[i].y
					})
				} else {
				//let maxVariance = Math.min(history[i - 1].y, history[i].y, history[i + 1].y) * ((0.04 / smoothingLevel) + 0.02)
					let oldY = chartThis[i].y
					let newY = chartThis[i - 1].y * 0.25 + chartThis[i].y * 0.5 + chartThis[i + 1].y * 0.25
					smoothedHistory.push({
						x: chartThis[i].x,
						y: Math.max(Math.min(oldY + maxVariance, newY), oldY - maxVariance)
					})
				}
			}
			chartThis = smoothedHistory
		}
	}

	let index = chart.data.datasets.findIndex(obj => obj.label == board)
	if(index != -1 && chart.data.datasets[index].data.length != chartThis.length){
		updateTime = 0
	}
	
	if (index != -1) {
		chart.data.datasets[index].data = chartThis
	} else {
		let color = availableColors.length ? availableColors.shift() : `hsla(${Math.ceil(Math.random() * 255)},50%,50%,1)`
		chart.data.datasets.push({
			label: board,
			data: chartThis,
			borderColor: color,
			backgroundColor: color
		})
	}
	chart.update(updateTime)
}

let removeBoard = board => {
	let index = chart.data.datasets.findIndex(obj => obj.label == board)
	if (index == -1) return
	let color = chart.data.datasets[index].borderColor
	if (color.startsWith("#")) {
		availableColors.unshift(color)
	}
	chart.data.datasets.splice(index, 1)
	chart.update(1000)
}

const chartFunctions = {
	init,
	addBoard,
	removeBoard
}

import Vue from 'vue'

const plugin = {
	install: Vue => {
		Vue.prototype.$chartFunctions = chartFunctions
	}
}
Vue.use(plugin)