const database = require('./database');

const RED_FLAGS = [
  'not fake news',
  'very much true',
  'harvard',
  'america',
  'rare',
  'official sources',
  'substantiation with data',
  'forwarded as received'
];

const RED_FLAG_THRESHOLD = 1;
const RED_FLAG_MESSAGE = {
  false: 'This message uses includes multiple terms that often appear in fake news chains. Proceed with caution 🚨'
};

const URL_SOURCE_MESSAGE = {
  verified: 'This source appears trustworthy ✅',
  caution: 'We were unable to verify this source. Please visit fact checking websites to decide to check yourself ⚠️',
  false: 'This source is a known manufacturer of fake news. Do not trust this source 🚨',
  falseArticle: 'It seems you have fallen for a fake story 😕 Be more careful in the future, please? \n\n Here is the proof: '
};

const ocr = (img) => {
    return {
      text: "Bengali is the sweetest language said UNESCO"
    };
}

const verifyUrl = (message) => {
  let unreliable = {
    source: null,
    article: null,
    article_proof: null
  }

  // let flaggedSource = false;
  // let flaggedArticle = false;

  if (/http|https|www|.com|.co.uk|.in|.news|.info/.test(message)) {
      console.log('URL detected in message');

      database.blacklist.articles.forEach((article) => {
          if (message.indexOf(article.url) > -1) {
              unreliable.article = true;
              unreliable.article_proof = article.proof;
          }
      });

      database.blacklist.sources.forEach((source) => {
          if (message.indexOf(source.url) > -1) {
              unreliable.source = true;
          }
      });
  }
    return unreliable
}

const checkForRedFlags = (message) => {
  let count = 0;

  RED_FLAGS.forEach((term) => {
    if (message.indexOf(term) > -1) count++;
  });

  return count > RED_FLAG_THRESHOLD;
};

const replyMessage = (messageId, text) => {
    return {
        msgId: messageId,
        msg: text
    }
};


const getCautionaryMessages = (messageId, redFlagged, unreliable) => {
    let messageQueue = [];

    if (redFlagged) {
      messageQueue.push(replyMessage(messageId, RED_FLAG_MESSAGE.false))
    }

    if (unreliable.article) {
        const msg = `${URL_SOURCE_MESSAGE.falseArticle}${unreliable.article_proof}`
        messageQueue.push(replyMessage(messageId, msg));
    } else if (unreliable.source) {
      messageQueue.push(replyMessage(messageId, URL_SOURCE_MESSAGE.false));
    } else {
        messageQueue.push(replyMessage(messageId, URL_SOURCE_MESSAGE.caution));
    }

      return messageQueue;
}

const forwardedMessageCheck = (message) => {
  if (message.hasOwnProperty('forward_from')) {

  }
}

const verify = (message) => {
  const username = message.from.first_name;
  const text = message.text.toLowerCase();
  const msgId = message.message_id;

  const messageQueue = getCautionaryMessages(
      msgId,
      checkForRedFlags(text),
      verifyUrl(text)
  );

  if (messageQueue.length > 0) {
      messageQueue.push(replyMessage(msgId,
          `Hey ${username}, you better check what you're sharing first!`));

  }
  console.log(messageQueue);

  return messageQueue;
};

module.exports = {
  ocr,
  verify
};
