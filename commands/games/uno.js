const getPlayers = require('../../utils/uno/getPlayers')
const giveHands = require('../../utils/uno/giveHands')
const deckCreator = require('../../utils/uno/deckCreator')
const draw = require('../../utils/uno/draw')
const playerDMs = require('../../utils/uno/playerDMs')
const shuffle = require('../../utils/uno/shuffle')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "uno",
    description: "Start a game of Uno",
    category: `Games`,
    permissions: ['EMBED_LINKS'],
    async execute(message) {
        if (message.client.uno.get(message.guild.id)) return message.channel.send(`There can only be one game of uno at a time!`)
        else message.client.uno.set(message.guild.id, true)
        const users = await getPlayers(message)
        if (users.length > 1) {
            let deck = await deckCreator(users.length)
            deck.current = shuffle(deck.current)
            let playerHands
            [playerHands, deck] = await giveHands(users, deck)
            let firstCard
            [firstCard, deck] = await draw(1, deck)
            deck.discard.push(firstCard)
            while (firstCard[0].type === 'special') {
                [firstCard, deck] = await draw(1, deck)
                deck.discard.push(firstCard[0])
            }
            const embed = new MessageEmbed()
                .setTitle(`Uno`)
                .setDescription(`Player ${playerHands[0].user.username}'s turn\n\nCard in play: ${firstCard[0].name}\n\n\n${playerHands.map(player => `${player.user.username}: ${player.hand.length} cards`).join('\n')}`)
                .setColor('LUMINOUS_VIVID_PINK')
                .setFooter(`Player Order: ${playerHands[1].user.username} ${playerHands[2] ? ', ' + playerHands[2].user.username : ', ' + playerHands[0].user.username}`)
                .setThumbnail(firstCard[0].image)
            const embedMessage = await message.channel.send(embed)
            const winner = await playerDMs(embedMessage, playerHands, deck, firstCard[0])
            message.channel.send(`Congratulations, ${winner.username}! You won!`)
        }
        message.client.uno.delete(message.guild.id)
    },
}