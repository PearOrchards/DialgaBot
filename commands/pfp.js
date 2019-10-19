exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./avatar.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "avatar",
    description: "Get yours (or someone else's) avatar!",
    aliases: "pfp, picture",
    usage: "d!avatar [@user]",
    cooldown: 5
}