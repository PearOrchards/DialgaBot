exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./say.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "say",
    description: "Make DialgaBot say something!",
    aliases: "speak",
    usage: "d!say <message>",
    cooldown: 5
}   