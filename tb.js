const _ = require('lodash');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
const dodgyTerms = ['not fake news', 'very much true', 'harvard', 'rare', 'official sources', 'substantiation with data', 'forwarded with data'];

const bot = new TelegramBot(config.token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.on('message', (message) => {
  const chatId = message.chat.id;

  const incomingMessage = message.text.toLowerCase();
  const outgoingMessage = messageHandler(incomingMessage);

  console.log(`Incoming message: ${incomingMessage}`);
  console.log(`Sending message: ${outgoingMessage}`);
  bot.sendMessage(chatId, outgoingMessage);
});

const verifyUrl = (message) => {
  return 'verified!';
}

const checkForDodgyTerms = (message) => {
  let count = 0;
  dodgyTerms.forEach((term) => {
    if (message.indexOf(term) > -1) count++;
  });

  const verdict = count > 2 ? 'This message looks dodgy' : 'looks okay lol';

  return verdict;
}

const messageHandler = (message) => {
  let verdict = 'NA';

  if (/http|https|www|.com|.co.uk|.in|/.test(message)) {
    console.log('url detected');
    verdict = verifyUrl(message);
  }

  verdict = checkForDodgyTerms(message);

  return verdict;
}
