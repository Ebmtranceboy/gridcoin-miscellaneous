const hidden = require('./hidden');

const telegramBot = require('node-telegram-bot-api');
const token = hidden.TOKEN;
const api = new telegramBot(token, {polling: true});

api.onText(/\/help/, function(msg, match) {
	var fromId = msg.from.id;
	api.sendMessage(fromId, "I can help you in getting the sentiments of any text you send to me.");
});

api.onText(/\/start/, function(msg, match) {
	var from = msg.from;
	api.sendMessage(from.id, `Yo ${from.username} (${from.first_name} ${from.last_name})!, they call me Gridcoin Miscellaneous Bot. 
	It is ${new Date(msg.date*1000)}.
	Text is ${msg.text}.
	I can help you in getting the sentiments of any text you send to me.
	To help you I just have few commands.\n/help\n/start\n/sentiments
	but most are to be implemented.`);
});

console.log("Gridcoin Miscellaneous Bot has started. Start conversations in your Telegram.");
