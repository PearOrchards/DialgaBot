const Discord = require('discord.js')
const fs = require("fs");

exports.run = (client, message, args, config, blacklist, wtpokes) => {
    if (!args[0]) {
        var embed = new Discord.RichEmbed()
            .setTitle("Commands within DialgaBot")
            .setThumbnail(client.user.avatarURL)
            .setDescription("These are all of the commands that you can find within DialgaBot. Well, the ones that users will need to know.\n*For the record, <> means that an argument is required, [] means that an argument can be added but it's not required*.")
            .addField("Fun Commands", "8ball, hurr, hurrd, meme, rate, say, sayd, wtp")
            .addField("Tag Commands", "tag, tagadd, tagdel, taglist")
            .addField("XP System", "gscore, score, gleaderboard, leaderboard")
            .addField("Information and Utility Commands", "avatar, ping, report, invite, donate, help, jointriggers, verification, logs, settings")
            .setFooter("You can get more specific help by using d!help <commmand>. Thanks for using Dialga!")
            .setColor((message.guild.members.get("373591512648384512").highestRole.color).toString(16))
        message.channel.send(embed)
    } else if (fs.existsSync(`./commands/${args[0]}.js`)) {
        var helpParameters = require(`./${args[0]}`)
        if (!helpParameters.help) return message.channel.send("DID YOU TYPE THE COMMAND YOU WANT HELP FOR CORRECTLY**?**")
        var embed = new Discord.RichEmbed()
            .setTitle(`Command: ${helpParameters.help['name']}`)
            .addField("Description", helpParameters.help['description'])
            .addField("Usage", helpParameters.help['usage'])
            .setFooter(`[Aliases: ${helpParameters.help['aliases']}] [Cooldown: ${helpParameters.help['cooldown']} seconds]`)
            .setColor((message.guild.members.get("373591512648384512").highestRole.color).toString(16))
            .setThumbnail(client.user.avatarURL)
        message.channel.send(embed)
    } else {
        message.channel.send("DID YOU TYPE THE COMMAND YOU WANT HELP FOR CORRECTLY?")
    }
}

exports.help = {
    name: "help",
    description: "You're asking me for help on something you just used.\nThis command shows you all of the commands, or help on a specific command.",
    aliases: "commandinfo",
    usage: "d!help [command]",
    cooldown: 3
}   