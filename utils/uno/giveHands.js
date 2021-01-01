const deal = require('./deal')
module.exports = async function giveHands(users, deck) {
    let changedDeck = deck
    const players = []
        users.forEach(user => {
                [hand, changedDeck] = deal(changedDeck)
                players.push({user, hand})
            })
    return [players, changedDeck]
}