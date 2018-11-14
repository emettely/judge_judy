const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const fetch = require('fetch');

const urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
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
    const ocr = ocr(img);
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

bot.on('message', (message) => {
  const chatId = message.chat.id;

  const outgoingMessage = messageHandler(message.text);

  console.log(`Sending message: ${outgoingMessage}`);
  bot.sendMessage(chatId, outgoingMessage);

});

const ocr = (img) => {

    // fetch.fetchUrl("https://vision.googleapis.com/v1/images:annotate", {
    //
    // }, (res) => {
    //
    // });
    return {text: "Bengali is the sweetest language said UNESCO"}
}

const verifyUrl = (msg) => {
  return 'verified!';
}

const messageHandler = (message) => {
  let verdict = 'NA';

  if (/http|https|www|.com|.co.uk|.in|/.test(message)) {
    console.log('url detected');
    verdict = verifyUrl(message);
  }

  return verdict;
}
