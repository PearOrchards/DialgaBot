exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./invite.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "invite",
    description: "Provides the link for adding DialgaBot to your own server, or joining the DialgaBot server.",
    aliases: "addme",
    usage: "d!invite",
    cooldown: 10
}   