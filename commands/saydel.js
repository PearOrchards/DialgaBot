exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./sayd.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "sayd",
    description: "Make DialgaBot say something, and then delete your message! Now everyone thinks Dialga is sentient, good job.",
    aliases: "saydel, speakd, speakdel",
    usage: "d!sayd <message>",
    cooldown: 5
}   