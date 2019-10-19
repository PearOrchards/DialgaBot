exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./8ball.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "8ball",
    description: "Ask a question, shake the 8-Ball, and... hope for a good answer.",
    aliases: "ask, advice, question",
    usage: "d!8ball <question>",
    cooldown: 4
}