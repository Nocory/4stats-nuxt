module.exports = {
	render: {
		resourceHints: false
	},
	/*
  ** Headers of the page
  */
	head: {
		title: '4stats.io',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'This site provides continuously updating statistics on 4chan boards & threads and also keeps a record of past board activity.' },
			{ name: 'google-site-verification', content: 'TILzvemVwW4O3wsWegRpNk1XByhw5JbCoTG9znFlBnc' },
			{ name: 'robots', content: 'noarchive' },
			{ name: 'google', content: 'notranslate' },
			{ name: 'referrer', content: 'never' },
			{ name: 'theme-color', content: '#2e3440' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
		]
	},
	css: [
		'~assets/css/main.scss'
	],
	plugins: [
		{ src: '~/plugins/socket.js', ssr: false },
		{ src: '~/plugins/chartFunctions.js', ssr: false }
	],
	/*
  ** Customize the progress bar color
  */
	loading: { color: '#3B8070' },
	/*
  ** Build configuration
  */
	build: {
		vendor: [
			
		],
		router: {
			mode: 'history'
		},
		/*
		babel: {
			plugins: ["syntax-dynamic-import","transform-object-rest-spread"],
			presets: [
				["env", {
					"targets": {
						"browsers": [
							"last 2 Chrome versions",
							"last 2 ChromeAndroid versions",
							"last 2 Firefox versions",
							"last 2 FirefoxAndroid versions",
							"last 2 Safari versions",
							"last 2 iOS versions",
							"last 2 Edge versions",
							"Chrome 41" // Googlebot renderer
						]
					},
					"debug": true,
					"modules": false
				}]
			]
		},
		*/
		/*
    ** Run ESLint on save
    */
		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
		}
	},
	extractCSS: true
}
