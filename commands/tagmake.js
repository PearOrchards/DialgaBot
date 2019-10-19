exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./tagadd.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "tagadd",
    description: "Adds a tag, with the text after the second space.",
    aliases: "tagmake",
    usage: "d!tagadd <tag name, no spaces> <text tag should display>",
    cooldown: 15
}