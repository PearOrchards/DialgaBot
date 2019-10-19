exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./taglist.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "taglist",
    description: "Lists all of the tags that you have.",
    aliases: "tagall",
    usage: "d!taglist",
    cooldown: 20
}