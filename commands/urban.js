exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./define.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "define",
    description: "Search the Urban Dictionary for a word. May be NSFW.",
    aliases: "urban, word",
    usage: "d!define <word>",
    cooldown: 5
}