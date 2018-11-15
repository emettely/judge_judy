let gameData = []

const newGame = (chatId, userId) => [
    {
        chatId: chatId,
        users: [
            {
                userId: userId,
                userDisplayName: "",
                score: {
                    good: 0,
                    bad: 0,
                    idk: 0
                }
            }
        ]
    }
];

const filterArr = (arr, searchKey) => arr.filter(obj => Object.keys(obj).some(key => obj[key] === searchKey));


const addTally = (chatId, userId, point) => {
    let chatGame = filterArr(gameData, chatId)
    if (chatGame.length === 0) {
        let chatGame = newGame(chatId, userId)
        gameData.push(chatGame)
    }

    let userGameData = filterArr(game, userId)
    if
    userGameData
}

module.exports = addTally;
