function divide (message, t, authorCaps, argsAll) {
    if(t > 10 ) {
        t /= 10
        divide(message, t, authorCaps, argsAll)
    } else {
        message.channel.send(`**${authorCaps.toUpperCase()}**, I'D RATE "${argsAll}" A **${Math.round(t)}/10**.`)
    }
}

exports.run = (client, message, args) => {
    var authorCaps = message.author.username
    if (!args[0]) return message.channel.send(`**${authorCaps.toUpperCase()}**, I'D RATE NOTHINGNESS A **0/10**.`);

    var argsAll = (args.join(" ").trim())
    var t = 0;
    var chars = argsAll.split("")

    for(i = 0; i < chars.length; i++) {
        var c = chars[i]
        var n = c.charCodeAt(0)
        n += 5
        n *= 25
        n -= 10
        n /= 5
        
        t += n
        t *= 2
        t += 600
    }

    divide(message, t, authorCaps, argsAll)
}

exports.help = {
    name: "rate",
    description: "DialgaBot rates your stuff, poorly.",
    aliases: "NONE",
    usage: "d!rate <thing to rate>",
    cooldown: 3
}   