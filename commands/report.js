const Discord = require("discord.js");

exports.run = (client, message, args, config) => {
    if (!args[0]) {
        message.channel.send("IT WOULD BE NICE IF YOU ACTUALLY SAID SOMETHING.")
    } else {
        var attachments = (message.attachments).array()
        var urls = []
        attachments.forEach(function(attachment) {
            urls.push(attachment.url)
        })
        console.log(urls)
        var mmssgg = args.join(" ").trim();
        var logChannel = client.channels.get("485497942770188289")
        var reportEmbed = new Discord.RichEmbed()
            .setTitle(`Report made by ${message.author.tag}`)
            .addField("The message:", mmssgg)
            .addField("Location:", (message.guild.name + " in " + message.channel.name))
            if (urls.length > 0) {
                reportEmbed.addField("Attachments:", urls)
            } else {    
                reportEmbed.addField("Attachments:", "There were no attachments.")
            }
            reportEmbed.setTimestamp()
            .setColor("#4286f4")
        logChannel.send(reportEmbed)
        message.channel.send("REPORT SENT! YOU CAN SEE IT IF YOU GO TO DIALGABOT'S SERVER, WHICH IS LOCATED IN `d!invite`!")
    }
}

exports.help = {
    name: "report",
    description: "Got a problem? Want to suggest something? Want to flood a channel? Feel free to send a report!",
    aliases: "feedback, problem, yesiwouldliketofloodachannelthanks",
    usage: "d!report <thing to report>",
    cooldown: 10
}   