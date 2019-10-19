exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./help.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "help",
    description: "You're asking me for help on something you just used.\nThis command shows you all of the commands, or help on a specific command.",
    aliases: "commandinfo",
    usage: "d!help [command]",
    cooldown: 3
}   