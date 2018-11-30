const hidden = require('./hidden');
const exec = require('child-process-async').exec;

const telegramBot = require('node-telegram-bot-api');
const token = hidden.TOKEN;
const api = new telegramBot(token, {polling: true});

api.onText(/\/help/, function(msg, match) {
	var fromId = msg.from.id;
	api.sendMessage(fromId, `Command <required parameter> [optional parameter (default parameter)] -- description:
	
	/start						-- welcoming message
	
	/difficulty					-- wealth of the network, the more the better. 
	
	/blockcount					-- current number of blocks in the Gridcoin's blockchain
	
	/blockhash	<index>				-- hash of block with index <index>
	
	/exchanges					-- exchanges and pairs that list $GRC (Coingecko)
	
	/price		[unit(usd)] [date(today)]	-- price (Coingecko)
	
	/volume		[unit(usd)] [date(today)]	-- volume (Coingecko)
	
	/capitalization	[unit(usd)] [date(today)]	-- capitalization (Coingecko)
	
	/ath		[unit(usd)]			-- all time high (Coingecko)
	
	/help						-- this message

							[unit] can be in fiat or crypto, but in lowercase
							[date] format is D[D] M[M] YYYY
	`);});

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
	var from = msg.from;
	api.sendMessage(from.id, `Yo ${from.username}!, I'm Gridcoin Miscellaneous Bot. 
	
	I can fetch several data around the internet to ease your journey during The Gridcoin Odyssey.
	
	Find a description of the main commands with /help.
	
	Read this welcoming message again with /start.`);
});

//api.on('photo', msg => api.sendMessage(msg.photo.id, `Photo id: ${msg.photo.id}`));

api.onText(/\/difficulty/, function(msg, match) {
	const from = msg.from;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getdifficulty', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/blockhash (\d+)/, function(msg, match) {
	const from = msg.from;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getblockhash?index='+match[1], {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/blockcount/, function(msg, match) {
	const from = msg.from;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/api/getblockcount', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/supply/, function(msg, match) {
	const from = msg.from;
	
	async function curl () {
		const child = await exec('curl https://grcexplorer.neuralminer.io/ext/getmoneysupply', {});
		api.sendMessage(from.id, child.stdout);
  	}
  	curl();
});

api.onText(/\/price( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.from;
	
	const ref = match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const resp = JSON.parse(child.stdout).market_data.current_price[ref];
		api.sendMessage(from.id, resp);
  	}
  	curl();
});

api.onText(/\/capitalization( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.from;
	
	const ref = match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const resp = JSON.parse(child.stdout).market_data.market_cap[ref];
		api.sendMessage(from.id, resp);
  	}
  	curl();
});

api.onText(/\/volume( +([a-z]+))?( +(\d+) +(\d+) +(\d+))?/, function(msg, match) {
	const from = msg.from;
	
	const ref = match[2]!=""?match[2]:'usd';
	const today = new Date(msg.date*1000);
	const date = match[3]!=""?`${match[4]}-${match[5]}-${match[6]}`:`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research/history?date='+date, {});
		const resp = JSON.parse(child.stdout).market_data.total_volume[ref];
		api.sendMessage(from.id, resp);
  	}
  	curl();
});

api.onText(/\/ath( +([a-z]+))?/, function(msg, match) {
	const from = msg.from;
	
	const ref = match[2]!=""?match[2]:'usd';
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research', {});
		const resp = JSON.parse(child.stdout).market_data.ath[ref];
		const date = JSON.parse(child.stdout).market_data.ath_date[ref].match(/^(\d+)-(\d+)-(\d+)/);
		api.sendMessage(from.id, `${resp} on ${date[3]} ${date[2]} ${date[1]}`);
  	}
  	curl();
});

api.onText(/\/exchanges/, function(msg, match) {
	const from = msg.from;
	
	async function curl () {
		const child = await exec('curl https://api.coingecko.com/api/v3/coins/gridcoin-research', {});
		const tickers = JSON.parse(child.stdout).tickers;
		let resp = "";
		tickers.forEach(ticker => {
			if(ticker.target == 'GRC' || ticker.base == 'GRC')
			resp += `${ticker.base} <-> ${ticker.target} : ${ticker.market.name}\n`});
		api.sendMessage(from.id, resp);
  	}
  	curl();
});

console.log("Gridcoin Miscellaneous Bot has started. Start conversations in your Telegram.");
