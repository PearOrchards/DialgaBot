exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./gleaderboard.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "gleaderboard",
    description: "Shows the global leaderboard",
    aliases: "gtop, globalleaderboard, globaltop",
    usage: "d!gleaderboard [page number]",
    cooldown: 15
}   