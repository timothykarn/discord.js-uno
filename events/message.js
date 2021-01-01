module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    const { prefix } = require('../config.json')

    const args = message.content.slice(prefix.length).trim().split(/ +/g); //splits message content into an array

    //checks if message starts with the prefix
    if (!message.content.startsWith(prefix)) return
    if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return //if user cannot send messages to prevent an error
    const cmd = args.shift().toLowerCase()
    if (cmd.length === 0) return //if no word is left to check

    let command = client.commands.get(cmd)
    if (!command) command = client.commands.get(client.aliases.get(cmd))
    if (!command) return

    if (command) {
        const icn = message.author.id + command.name

        //checks for a command cooldown && user's cooldown
        if (command.cooldown && client.userCooldowns.get(icn)) {
            const timer = Math.round((client.userCooldowns.get(icn) - Date.now()) / 1000)
            const msg = await message.channel.send(`You cannot use that command so fast. Please wait ${timer} seconds`)
            if (message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return await msg.delete({ timeout: (timer < 1 ? 1000 : timer * 1000) })
            }
        if (!message.channel.permissionsFor(message.guild.me).has(command.permissions)) return message.channel.send(`I cannot complete that command, please make sure I have the \`${command.permissions.join(' ').toLowerCase().replace(/_/g, ' ')}\` permissions!`)

        try {
            //executes the command
            await command.execute(message, args)

            if (command.cooldown) {
                const timer = command.cooldown * 1000
                client.userCooldowns.set(icn, Date.now() + timer)
                setTimeout(()=> client.userCooldowns.delete(icn), timer)
            }
        } catch (e) {
            console.error(e)
            return message.channel.send(`There was an issue with ${command.name}!`)
        }

}
}
