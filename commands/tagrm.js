exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./tagdel.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "tagdel",
    description: "Deletes a tag",
    aliases: "tagremove, tagrm",
    usage: "d!tagdel <tag name>",
    cooldown: 15
}