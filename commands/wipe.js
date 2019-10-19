exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./purge.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "purge",
    description: "Deletes 2 - 200 messages at once, if they're not over 14 days old.",
    aliases: "clear, wipe",
    usage: "d!purge <number of messages to delete>",
    cooldown: 5
}  