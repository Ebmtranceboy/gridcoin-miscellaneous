const hidden = require('./hidden');
const exec = require('child-process-async').exec;
const https = require('https');
const telegramBot = require('node-telegram-bot-api');

const token = hidden.TOKEN;
const api = new telegramBot(token, {polling: true});

api.onText(/\/help/, function(msg, match) {
	var fromId = msg.chat.id;
	api.sendMessage(fromId, `Command <required parameter> [optional parameter (default parameter)] -- description:
	
	/start						-- welcoming message

	/whitelist					-- current whitelist
	
	/difficulty					-- wealth of the network, the more the better. 
	
	/blockcount					-- current number of blocks in the Gridcoin's blockchain
	
	/blockhash	<index>				-- hash of block with index <index>
	
	/exchanges					-- exchanges and pairs that list $GRC (Coingecko)
	
	/price		[unit(usd)] [date(today)]	-- price (Coingecko)
	
	/volume		[unit(usd)] [date(today)]	-- volume (Coingecko)
	
	/capitalization	[unit(usd)] [date(today)]	-- capitalization (Coingecko)
	
	/ath		[unit(usd)]			-- all time high (Coingecko)

	/about						-- internet sources
	
	/help						-- this message

							[unit] can be in fiat or crypto, but in lowercase
							[date] format is D[D] M[M] YYYY
	`);});

api.onText(/\/about/, function(msg, match){api.sendMessage(msg.chat.id,'Various Gridcoin-related informations from www.coingecko.com, grcexplorer.neuralminer.io, gridcoin.us');});

api.onText(/\/png/, function(msg, match) {
	var fromId = msg.from.id;
	api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me.");
	
	//const fp = open('./periodic-table.png', 'rb')
	//const file_info = InputFileInfo('periodic-table.png', fp, 'image/png')
	async function convert (){
	}
	convert ();
	
	exec("convert drawing.svg drawing.png");
	setTimeout(()=>api.sendPhoto( msg.chat.id,'./drawing.png' , {caption: "awesome!"},{contentType: 'image/png'}),3000);
 
});

api.onText(/\/start/, function(msg, match) {
	var from = msg.chat;
	api.sendMessage(from.id, `Yo ${from.username}!, I'm Gridcoin Miscellaneous Bot. 
	
	I can fetch several data around the internet to ease your journey during The Gridcoin Odyssey.
	
	Find a description of the main commands with /help.
	
	Read this welcoming message again with /start.`);
});


api.onText(/\/whitelist/, function(msg, match){
	let page = "";
	https.get('https://gridcoin.us/Guides/whitelist.htm', (res) =>{
		res.on('data', (d) => page += d.toString('utf8'));
		res.on('end', () => {
			const tbody = page.match(/<tbody>[^]*?<\/tbody>/g);
			let as = tbody[1].match(/<a[^>]*>[^]*?<\/a>/g);
			const whitelist = as.map(a=>a.replace(/<a[^>]*>/,'').replace(/<\/a>/,''));
			api.sendMessage(msg.chat.id, whitelist.join(', '));
			});
		});
	}
);

api.onText(/\/difficulty/, function(msg, match) {
	const from = msg.chat;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getdifficulty', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/blockhash (\d+)/, function(msg, match) {
	const from = msg.chat;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getblockhash?index='+match[1], {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/blockcount/, function(msg, match) {
	const from = msg.chat;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getblockcount', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/supply/, function(msg, match) {
	const from = msg.chat;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/ext/getmoneysupply', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/price( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.chat;
	
	const ref = match[2]&&match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]&&match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const prices = JSON.parse(child.stdout).market_data.current_price;
		if(Object.keys(prices).includes(ref))
			api.sendMessage(from.id, prices[ref]);
		else api.sendMessage(from.id, `${ref} non supported`);
  	}
  	curl();
});

api.onText(/\/capitalization( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.chat;
	
	const ref = match[2]&&match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]&&match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const caps = JSON.parse(child.stdout).market_data.market_cap;
		if(Object.keys(caps).includes(ref))
			api.sendMessage(from.id, caps[ref]);
		else api.sendMessage(from.id, `${ref} non supported`);
  	}
  	curl();
});

api.onText(/\/volume( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.chat;
	
	const ref = match[2]&&match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]&&match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const vols = JSON.parse(child.stdout).market_data.total_volume;
		if(Object.keys(vols).includes(ref))
			api.sendMessage(from.id, vols[ref]);
		else api.sendMessage(from.id, `${ref} non supported`);
  	}
  	curl();
});

api.onText(/\/ath( +([a-z]+))?/, function(msg, match) {
	const from = msg.chat;
	
	const ref = match[2]&&match[2]!=""?match[2]:'usd';
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research', {});
		const resp = JSON.parse(child.stdout).market_data.ath[ref];
		const date = JSON.parse(child.stdout).market_data.ath_date[ref].match(/^(\d+)-(\d+)-(\d+)/);
		api.sendMessage(from.id, `${resp} on ${date[3]} ${date[2]} ${date[1]}`);
  	}
  	curl();
});

api.onText(/\/exchanges/, function(msg, match) {
	const from = msg.chat;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research', {});
		const tickers = JSON.parse(child.stdout).tickers;
		let resp = "";
		tickers.forEach(ticker => {
			if(ticker.target == 'GRC' || ticker.base == 'GRC')
			resp += `${ticker.base} <-> ${ticker.target} : ${ticker.market.name}\n`});
		api.sendMessage(from.id, `${resp}\n\nsee also bisq(https://bisq.network), flyp.me(http://flyp.me)` );
  	}
  	curl();
});

console.log("Gridcoin Miscellaneous Bot has started. Start conversations in your Telegram.");
