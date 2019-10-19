exports.run = (client, message, args, config, blacklist) => {
    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) return message.channel.send("I CAN'T DELETE MESSAGES. USE 'SAY' INSTEAD.");
    if (args.join(" ").trim().toUpperCase() == "") return message.channel.send("IT'D BE NICE IF YOU TOLD ME WHAT TO SAY.");
        message.delete().then(function(msg) {
            message.channel.send(args.join(" ").trim().toUpperCase());
        });
}

exports.help = {
    name: "sayd",
    description: "Make DialgaBot say something, and then delete your message! Now everyone thinks Dialga is sentient, good job.",
    aliases: "saydel, speakd, speakdel",
    usage: "d!sayd <message>",
    cooldown: 5
}   