const shuffle = require('./shuffle')
module.exports = function draw(drawAmount, deck) {
    const cards = []
    for (let i = 0; drawAmount > i; i++) {
        if (deck.current.length === 0) {
            deck = {current: deck.discard, discard: []}
            deck.current = shuffle(deck.current)
        }
        cards.push(deck.current[0])
        deck.current.splice(0, 1)
    }
    return [cards, deck]
}