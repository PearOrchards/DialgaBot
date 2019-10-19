exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./grank.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "grank",
    description: "Shows your (or someone else's) global rank",
    aliases: "gme, globalrank, globalme, gscore, globalscore",
    usage: "d!grank [@user]",
    cooldown: 5
}   