const { MessageEmbed } = require('discord.js')
const draw = require('./draw')
module.exports = async function playerDMs(embedMessage, playerHands, deck, firstCard) {
    let playersActive = true
     while(playerHands.filter(player => player.hand.length === 0).length !== 1 && playersActive) {
         let {user, hand} = playerHands[0]
         if (!playerHands[0].inactive) playerHands[0].inactive = 0
         if (playerHands[0].inactive > 2) {
             playerHands.splice(0, 1)
             deck.discard.concat(hand)
             return embedMessage.channel.send(`Player ${user.username} has been kicked from the game due to inactivity`)
         }
         if (playerHands.length === 0) return playersActive = false
         let index = 1
         let canPlay = false
         hand.forEach(card => {
             if (card.color === firstCard.color || card.value === firstCard.value || card.color === 'all') canPlay = true
         })
         if (canPlay) {
         let userEmbed = new MessageEmbed()
             .setTitle(`${user.username}'s hand:`)
             .setDescription(`${hand.map(card => {
                 return `[${index++}] ${card.name}`
             }).join('\n')}\nCard in play: ${firstCard.name}`)
             .setColor('LUMINOUS_VIVID_PINK')
             .setThumbnail(firstCard.image)
             .setFooter(`If you cannot play a card, type \`draw\` to draw a card`)
         const dm = await user.send(`Which card do you want to play?`, userEmbed)
             const msgResponse = await dm.channel.awaitMessages(msg => parseInt(msg.content) && hand.length >= parseInt(msg.content) || msg.content === 'draw', {
                 time: 50000,
                 max: 1
             })
             if (msgResponse.first()) {
                 if (msgResponse.first().content.toLowerCase() === 'draw') {
                     let cards
                     [cards, deck] = draw(1, deck)
                     hand.push(cards[0])
                     embedMessage.channel.send(`${user.username} drew a card!`)
                 } else {
                     const response = parseInt(msgResponse.first().content) - 1
                     if (hand[response].color === firstCard.color || hand[response].value === firstCard.value || hand[response].color === 'all') {
                         deck.discard.push(firstCard)
                         if (hand[response].name.includes('wild') && hand[response].color !== 'all') hand[response].color = 'all'
                         firstCard = hand[response]
                         hand.splice(hand.indexOf(firstCard), 1)
                         if (firstCard.color === 'all') {
                             dm.channel.send(`What color do you want to make it? (red, green, yellow or blue?)`)
                             const msgResponse = await dm.channel.awaitMessages(msg => ['red', 'green', 'blue', 'yellow'].includes(msg.content), {
                                 time: 60000,
                                 max: 1
                             })
                             firstCard.color = msgResponse.first() ? msgResponse.first().content : 'blue'
                             embedMessage.channel.send(`${user.username} made the color to be ${firstCard.color}`)
                         }
                         if (firstCard.reverse) {
                             embedMessage.channel.send(`The order has been reversed!`)
                             playerHands.reverse()
                         }
                         if (firstCard.adds) {
                             embedMessage.channel.send(`${user.username} made ${playerHands[1].user.username} draw ${firstCard.adds} cards!`)
                             let cards
                             [cards, deck] = draw(firstCard.adds, deck)
                             playerHands[1].hand = playerHands[1].hand.concat(cards)
                         }
                         if (firstCard.skip) {
                             embedMessage.channel.send(`${user.username} skipped ${playerHands[1].user.username}!`)
                             if (playerHands.length > 2) {
                                 const affectedPlayer = playerHands[1]
                                 playerHands.splice(1, 1)
                                 playerHands.push(affectedPlayer)
                             } else {
                                 playerHands.reverse()
                             }
                         }
                         const gameEmbed = new MessageEmbed()
                             .setTitle(`Uno`)
                             .setDescription(`Player ${playerHands[1].user.username} is now playing\n\nCard in play: ${firstCard.name}\n\n\n${playerHands.map(player => `${player.user.username}: ${player.hand.length} cards`).join('\n')}`)
                             .setColor('LUMINOUS_VIVID_PINK')
                             .setFooter(`Player Order: ${playerHands[1].user.username} ${playerHands[2] ? ', ' + playerHands[2].user.username : ', ' + playerHands[0].user.username}`)
                             .setThumbnail(firstCard.image)
                         const msg = await embedMessage.channel.send(gameEmbed)
                         userEmbed = new MessageEmbed()
                             .setDescription(`[return to the game channel](${msg.url})`)
                             .setColor('LUMINOUS_VIVID_PINK')
                         await dm.edit(userEmbed)
                     }
                 }
         } else {
                 embedMessage.channel.send(`${user.username} didn't reply in time!`)
                 playerHands[0].inactive++
             }
         } else {
             embedMessage.channel.send(`Player ${user.username} could not play and had to draw!`)
             let cards
             [cards, deck] = draw(1, deck)
             hand = hand.concat(cards)
         }
         if (hand.length === 1) {
             const msgResponse = await embedMessage.channel.awaitMessages(msg => msg.author.id === user.id && msg.content.toLowerCase() === 'uno', {
                 time: 10000,
                 max: 1
             })
             if (!msgResponse.first()) {
                 embedMessage.channel.send(`${user.username} failed to say uno in chat within 10 seconds and had to draw!`)
                 let cards
                 [cards, deck] = draw(1, deck)
                 hand = hand.concat(cards)
             } else embedMessage.channel.send(`${user.username} said uno within the allotted time`)
         }
             playerHands.push(playerHands[0])
             playerHands.splice(playerHands[0], 1)
     }
     return playerHands.filter(player => player.hand.length === 0)[0].user
}