module.exports = function deckCreator(playerSize) {
    const deck = {current: [], discard: []}
    const iterator = {red: 0, yellow: 0, blue: 0, green: 0}
    const colors = ['red', 'yellow', 'blue', 'green']
    colors.forEach(color => {
        while (iterator[color] < 10) {
            deck.current.push({
                name: `${color} ${iterator[color]}`,
                type: 'normal',
                color: color,
                value: iterator[color],
                image: `http://unocardinfo.victorhomedia.com/graphics/uno_card-${color}${iterator[color]++}.png`
            })
    }
       deck.current.push({
            name: `${color} skip`, type: 'special', skip: true, color: color, image: `http://unocardinfo.victorhomedia.com/graphics/uno_card-${color}skip.png`
       }, {
           name: `${color} plus two`, type: 'special', skip: true, adds: 2, color: color, image: `http://unocardinfo.victorhomedia.com/graphics/uno_card-${color}draw2.png`
        }, {
           name: `${color} reverse`, type: 'special', reverse: true, color: color, image: `http://unocardinfo.victorhomedia.com/graphics/uno_card-${color}reverse.png`
        }, {
           name: `plus four wild card`, type: 'special', skip: true, color: 'all', adds: 4, image: 'http://unocardinfo.victorhomedia.com/graphics/uno_card-wilddraw4.png'
       }, {
           name: `wild card`, type: 'special', color: 'all', image: 'http://unocardinfo.victorhomedia.com/graphics/uno_card-wildchange.png'
       })
    })
    if (playerSize > 6) deck.current.concat(deck.current)
    if (playerSize > 12) deck.current.concat(deck.current)
    return deck
}