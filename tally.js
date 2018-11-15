const _ = require('lodash');

let gameData = []


const THRESHOLD = 3
const MESSAGES = [
    "Don't be an Unkill!",
    "Let's not be like some baffoons and check facts.",
    "Do you think this is funny?",
    "How about your guilty conscience?",
    "Where are your morals?",
    "Can you please, just, check.",
    "*Dies inside*",
    "Did your family not teach you anything?",
    "Well, you do you...",
    "*Sigh*",
    "Why?",
    "*Glares*",
    "*Gives you the stink eye*",
    "You are a fake news reporter. Congratulations.",
    "Check. Your. Facts!"
]

const newGame = (chatId, userId) => {
    return {
        chatId: chatId,
        users: [
            {
                userId: userId,
                score: {
                    good: 0,
                    bad: 0,
                    idk: 0
                }
            }
        ]
    }
};

// const filterArr = (arr, searchKey) => arr.filter(obj => Object.keys(obj).some(key => obj[key] === searchKey));


const sumValues = obj => Object.values(obj).reduce((a, b) => a + b);

const isGood = (tally) => {return (tally === 1)};

const getMessage = (tally, total) => {
    let message = null
    console.log("tallyyyyy");
    console.log(tally, total);
    if (tally !== 0) {
        if (total === 1) {
            if (isGood(tally)) {
                message = "You are off to a good start :)"
            } else {
                message = "Strike 1 - I'm keeping an eye on you."
            }
        } else if (total === 2) {
            if (!isGood(tally)) {
                message = "Strike 2!"
            }
        } else if (total === 3) {
            if (!isGood(tally)) {
                message = "You are doing amazingly! Pick a reward :D"
            } else {
                message = "Strike 3!!! :("
            }
        } else {
            if (!isGood(tally) && total % THRESHOLD === 0) {
                message = MESSAGES[Math.floor(Math.random()*MESSAGES.length)]
            }
        }
    }
    console.log("message");
    console.log(message);
    return message
}

const updateTally = (chatId, userId, tally) => {
    let update;

    let chatGameIndex = gameData.findIndex(x => x.chatId === chatId);
    let chatGame = gameData[chatGameIndex];

    if (chatGame === undefined) {
        update = newGame(chatId, userId);
        chatGameIndex = 0;
        console.log("New Game");
    } else {
        console.log("Existing game");
        update = _.cloneDeep(chatGame);
        console.log("created update");
    }
    let userGameIndex = update.users.findIndex(x => x.userId === userId);
    let userGameData = update.users[userGameIndex];
    console.log(userGameIndex, userGameData);

    if (userGameData === undefined) {
        console.log("New User");
        let userGameData = {
            userId: userId,
            score: {
                good: 0,
                bad: 0,
                idk: 0
            }
        };
        userGameIndex = 0
        update.users.push(userGameData)
    } else {
        console.log("Existing user");
    }

    if (tally === 0) {
        userGameData.score.idk += 1
    } else if (tally === 1) {
        userGameData.score.good += 1
    } else {
        userGameData.score.bad += 1
    }
    
    console.log(userGameData.score);

    gameData[chatGameIndex] = update

    console.log("updated")
    return getMessage(tally, sumValues(userGameData.score))

}

module.exports = updateTally;
