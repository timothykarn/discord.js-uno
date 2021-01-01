const { readdirSync } = require('fs');
module.exports = (client) => {

    //reads each folder
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js')); //filters to js files in any command directory

        for (let file of commands) {
            const command = require(`../commands/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
            }

            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => {
                    return client.aliases.set(alias, command.name);
                });
            }
        }
    })
}