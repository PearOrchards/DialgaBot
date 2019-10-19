exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./leaderboard.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "leaderboard",
    description: "Shows the server's leaderboard.",
    aliases: "top",
    usage: "d!leaderboard [page]",
    cooldown: 15
}  