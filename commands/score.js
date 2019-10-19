exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./rank.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "rank",
    description: "Shows your (or someone else's) server rank",
    aliases: "me, score",
    usage: "d!rank [@user]",
    cooldown: 5
}   