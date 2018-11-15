const fetch = require('fetch');

const database = require('./database');

const RED_FLAGS = [
  'not fake news',
  'very much true',
  'harvard',
  'america',
  'rare',
  'official sources',
  'substantiation with data',
  'forwarded with data'
];

const RED_FLAG_THRESHOLD = 1;
const RED_FLAG_MESSAGE = {
  false: 'This message uses includes multiple terms that often appear in fake news chains. Proceed with caution 🚨'
};

const URL_SOURCE_MESSAGE = {
  verified: 'This source appears trustworthy ✅',
  caution: 'We were unable to verify this source. Proceed with caution ⚠️',
  false: 'This source is a known manufacturer of fake news. Do not trust this source 🚨'
};

const ocr = (img) => {
    return {
      text: "Bengali is the sweetest language said UNESCO"
    };
}

const verifyUrl = (message) => {
  let flagged = false;
  if (/http|https|www|.com|.co.uk|.in|.news/.test(message)) {
    console.log('URL detected in message');

    database.blacklist.sources.forEach((source) => {
      if (message.indexOf(source.url) > -1) flagged = true;
    });

    return flagged ? URL_SOURCE_MESSAGE.false : URL_SOURCE_MESSAGE.caution;
  } else {
    return null;
  }
}

const checkForRedFlags = (message) => {
  let count = 0;

  RED_FLAGS.forEach((term) => {
    if (message.indexOf(term) > -1) count++;
  });

  return count > RED_FLAG_THRESHOLD ? RED_FLAG_MESSAGE.false : null;
}

const verify = (message) => {
  const username = message.from.first_name;
  const text = message.text.toLowerCase();

  const messageQueue = [];

  messageQueue.push(checkForRedFlags(text));
  messageQueue.push(verifyUrl(text));

  // removes the null elements from the above checks
  messageQueueFiltered = messageQueue.filter(Boolean);
  if (messageQueueFiltered.length > 0) {
    messageQueueFiltered.push(`Hey ${username}, you better check what you're sharing first!`);
  }
  console.log(messageQueueFiltered)

  return messageQueueFiltered;
}

module.exports = {
  ocr,
  verify
};
