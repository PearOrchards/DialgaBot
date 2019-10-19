exports.run = (client, message, args, config) => {
    if (args.join(" ").trim().toUpperCase() == "") return message.channel.send("IT'D BE NICE IF YOU TOLD ME WHAT TO SAY.");
    message.channel.send(args.join(" ").trim().toUpperCase());
}

exports.help = {
    name: "say",
    description: "Make DialgaBot say something!",
    aliases: "speak",
    usage: "d!say <message>",
    cooldown: 5
}   