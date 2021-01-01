const {Client} = require('discord.js');
const {token} = require('./config.json');
const fs = require('fs');
const client = new Client({disableMentions: "everyone" });
client.commands = new Map();
client.aliases = new Map();
client.userCooldowns = new Map();
client.uno = new Map();

//command handler
['command'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

//event handler
fs.readdir('./events/', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)]
    });
})

//login to client
client.login(token).then()