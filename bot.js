const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');

const config = require('./config');
const messageHandler = require('./messageHandler');

const bot = new TelegramBot(config.token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  bot.sendMessage(chatId, resp);
});

bot.on('photo', (img) => {
    const imgid = img.id;
    /** criteria from earlier
     * garish colours
     * too much text
     * reverse search images
     * text that mentions BBC etc. **/

    // do OCR to get text
    const ocr = messageHandler.ocr(img);
    const outgoingMessage = messageHandler(ocr.text);

    console.log(`Sending message: ${outgoingMessage}`);
    bot.sendMessage(imgid, outgoingMessage);

});

bot.on('video', (v) => {
    const vid = v.id;
});

bot.on('audio', (a) => {
    const aid = a.id;
});

bot.on('text', (message) => {
  console.log(message);

  const chatId = message.chat.id;

  const incomingMessage = message.text.toLowerCase();
  const outgoingMessage = messageHandler.verify(incomingMessage);

  console.log(`Incoming message: ${incomingMessage}`);
  console.log(`Sending message: ${outgoingMessage}`);
  bot.sendMessage(chatId, outgoingMessage);

});

module.exports = bot;
