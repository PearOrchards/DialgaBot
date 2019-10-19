exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./jointriggers.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "jointriggers",
    description: "The system which DialgaBot can be automated to do something upon someone joining a server. If you need extra help, consult PKPear#2121, and he'll (probably) add extended help. You'll need it.",
    aliases: "onjoin",
    usage: "d!jointriggers <add/delete/list>",
    cooldown: 30
}   