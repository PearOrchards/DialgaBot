exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./hurrd.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "hurrd",
    description: "MaKeS YoUr mEsSaGeS LoOk lIkE ThIs!\nBasically, make a message look like it's coming from an idiot, but then the commanding message gets deleted!",
    aliases: "hurrdel, hurrdelete",
    usage: "d!hurrd <message>",
    cooldown: 5
}   