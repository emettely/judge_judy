const database = require('./database');

const RED_FLAGS = ['not fake news', 'very much true', 'harvard', 'america', 'rare', 'official sources', 'substantiation with data', 'forwarded with data'];
const RED_FLAG_THRESHOLD = 1;
const VERDICT_MESSAGE = {
  verified: 'This message appears trustworthy ✅',
  cautious: 'We were unable to verify this source. Proceed with caution ⚠️',
  false: 'This has been flagged as an untrustworthy message 🚨'
};

const ocr = (img) => {
    // fetch.fetchUrl("https://vision.googleapis.com/v1/images:annotate", {
    //
    // }, (res) => {
    //
    // });
    return {
      text: "Bengali is the sweetest language said UNESCO"
    };
}

const verifyUrl = (message) => {
  let flagged = false;

  if (/http|https|www|.com|.co.uk|.in|.news|/.test(message)) {
    console.log('URL detected in message');

    database.blacklist.sources.forEach((source) => {
      if (message.indexOf(source.url) > -1) flagged = true;
    });
  }

  return flagged ? VERDICT_MESSAGE.false : VERDICT_MESSAGE.cautious;
}

const checkForRedFlags = (message) => {
  let count = 0;

  RED_FLAGS.forEach((term) => {
    if (message.indexOf(term) > -1) count++;
  });

  return count > RED_FLAG_THRESHOLD ? VERDICT_MESSAGE.false : VERDICT_MESSAGE.verified;
}

const verify = (message) => {
  let verdict = 'NA';

  verdict = checkForRedFlags(message);
  verdict = verifyUrl(message);

  return verdict;
}

module.exports = {
  ocr,
  verify
};
