//deals out 8 cards to each player object
module.exports = function deal(deck) {
    let hand = []
    for (let i = 0; i < 8; i++) {
        if (deck.current.length === 0) deck = {current: deck.discard, discard: []}
        hand.push(deck.current[0])
        deck.current.splice(0, 1)
    }
    return [hand, deck]
}