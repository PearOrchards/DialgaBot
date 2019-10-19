exports.run = (client, message, args, config, blacklist, wtpokes) => {
    message.channel.send("WHEN I SAY THERE'S NO ALIASES FOR A COMMAND, I MEAN THERE'S NO ALIASES. THIS ISN'T AN ALIAS!")
}

exports.help = {
    name: "none",
    description: "No I mean there isn't an alias not that there's an alias called 'none'!",
    aliases: "NONE",
    usage: "Don't do it you fool.",
    cooldown: 483
}