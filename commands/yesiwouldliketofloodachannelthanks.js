exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./report.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "report",
    description: "Got a problem? Want to suggest something? Want to flood a channel? Feel free to send a report!",
    aliases: "feedback, problem, yesiwouldliketofloodachannelthanks",
    usage: "d!report <thing to report>",
    cooldown: 10
}   