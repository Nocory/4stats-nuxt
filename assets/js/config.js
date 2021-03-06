const VERSION = 9
if(process.browser && localStorage.getItem("VERSION") != VERSION){
	localStorage.clear()
	localStorage.setItem("VERSION",VERSION)
}

console.log()

const config = {
	VERSION,
	debugLevelProduction: "info",
	debugLevelDevelopment: "trace",
	url: process.env.NODE_ENV == "production" && process.server ? "http://localhost:4001" : "https://api.4stats.io",
	safeInitialBoard : ["3","an","ck","diy","g","gd","his","lit","n","news","o","out","p","po","sci","tg","trv","vr","wg"],
	availableBoards : {
		main: [
			'3',
			'a',
			'adv',
			'an',
			'asp',
			'bant',
			'biz',
			'cgl',
			'ck',
			'co',
			'diy',
			'fa',
			'fit',
			'g',
			'gd',
			'his',
			'ic',
			'int',
			'jp',
			'k',
			'lgbt',
			'lit',
			'm',
			'mlp',
			'mu',
			'n',
			'news',
			'o',
			'out',
			'p',
			'po',
			'pol',
			'qst',
			'r9k',
			'sci',
			'sp',
			'tg',
			'toy',
			'trv',
			'tv',
			'v',
			'vg',
			'vp',
			'vr',
			'wsr',
			'x',
		],
		imageGenerals:[
			'c',
			'cm',
			'i',
			'w',
			'wg',
			'wsg',
		],
		misc:[
			'f',
			'qa',
			'vip',
		],
		nsfw:[
			'aco',
			'b',
			'd',
			'e',
			'gif',
			'h',
			'hc',
			'hm',
			'hr',
			'r',
			's',
			's4s',
			'soc',
			't',
			'trash',
			'u',
			'y'
		]
	},
	boardNames: {
		'3': '3DCG',
		a: 'Anime & Manga',
		aco: 'Adult Cartoons',
		adv: 'Advice',
		an: 'Animals & Nature',
		asp: 'Alternative Sports & Wrestling',
		b: 'Random',
		bant: 'International/Random',
		biz: 'Business & Finance',
		c: 'Anime/Cute',
		cgl: 'Cosplay & EGL',
		ck: 'Food & Cooking',
		cm: 'Cute/Male',
		co: 'Comics & Cartoons',
		d: 'Hentai/Alternative',
		diy: 'Do It Yourself',
		e: 'Ecchi',
		f: 'Flash',
		fa: 'Fashion',
		fit: 'Fitness',
		g: 'Technology',
		gd: 'Graphic Design',
		gif: 'Adult GIF',
		h: 'Hentai',
		hc: 'Hardcore',
		his: 'History & Humanities',
		hm: 'Handsome Men',
		hr: 'High Resolution',
		i: 'Oekaki',
		ic: 'Artwork/Critique',
		int: 'International',
		jp: 'Otaku Culture',
		k: 'Weapons',
		lgbt: 'LGBT',
		lit: 'Literature',
		m: 'Mecha',
		mlp: 'Pony',
		mu: 'Music',
		n: 'Transportation',
		news: 'Current News',
		o: 'Auto',
		out: 'Outdoors',
		p: 'Photography',
		po: 'Papercraft & Origami',
		pol: 'Politically Incorrect',
		qa: 'Question & Answer',
		qst: 'Quests',
		r: 'Adult Requests',
		r9k: 'ROBOT9001',
		s: 'Sexy Beautiful Women',
		s4s: 'Shit 4chan Says',
		sci: 'Science & Math',
		soc: 'Cams & Meetups',
		sp: 'Sports',
		t: 'Torrents',
		tg: 'Traditional Games',
		toy: 'Toys',
		trash: 'Off-Topic',
		trv: 'Travel',
		tv: 'Television & Film',
		u: 'Yuri',
		v: 'Video Games',
		vg: 'Video Game Generals',
		vip: 'Very Important Posts',
		vp: 'Pokémon',
		vr: 'Retro Games',
		w: 'Anime/Wallpapers',
		wg: 'Wallpapers/General',
		wsg: 'Worksafe GIF',
		wsr: 'Worksafe Requests',
		x: 'Paranormal',
		y: 'Yaoi',
	}
}

config.allBoards = Object.keys(config.availableBoards).reduce((acc,key) => [...acc,...config.availableBoards[key]],[])
config.allBoards.sort()

export default config