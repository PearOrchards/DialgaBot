exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./meme.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "meme",
    description: "Pulls a meme from reddit. May be NSFW.",
    aliases: "plsmeme, ifunnycoisagoodwebsiteapparently",
    usage: "d!meme",
    cooldown: 3
}  