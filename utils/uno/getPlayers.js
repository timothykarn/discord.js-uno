const { MessageEmbed } = require('discord.js')
module.exports = async function userInit(message) {
    const cards = { Skip: 'The next player is "skipped".', Reverse: 'Reverses the direction of play.', 'Draw 2 / 4': 'The next player must draw cards and lose a turn.', 'Wild Card': 'Play this card to change the color to be matched.'}
    const embed = new MessageEmbed()
        .setAuthor(`Uno for ${message.guild.name}`, message.client.user.displayAvatarURL())
        .setColor('RANDOM')
        .setDescription(`React to join the game! You have fifty seconds to react!`)
        .addField(`Rules:`, `1. Remember to say "uno" in ${message.channel} or else you will draw a card.\n2. Cards can only be played when the color or the numbers are matching. Exceptions are wild cards which can become any color.\n3. The player who gets rid of all their cards first wins`)
        .addField(`Cards:`, Object.entries(cards).map(([key, value]) => `**${key}**: \`${value}\``).join('\n'))
    const start = await message.channel.send(embed)
    await start.react('✅').then()
    const users = []
    const reactions = await start.awaitReactions((reaction, user) => '✅' === reaction.emoji.name, {max: 15, time: 50000})
    reactions.map(entry => {
        entry.users.cache.filter((value, key) => value.id !== message.client.user.id).map(user => {
            users.push(user)
        })
    })
    if (users.length < 2) return message.channel.send('Not enough players reacted!')
    message.channel.send(`Starting the game with ${users.length} players.`)
    return users
}