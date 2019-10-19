const urban = require('relevant-urban')
const Discord = require('discord.js')

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send("YOU DIDN'T SPECIFY A WORD TO DEFINE!")

    let res = await urban(args.join(' ')).catch(e => {return message.channel.send("SORRY, THAT WAS NOT DEFINED.")});
    if (!res.word) return;

    var defEmbed = new Discord.RichEmbed()
        defEmbed.setThumbnail("https://vignette.wikia.nocookie.net/logopedia/images/0/0b/UDFavicon.png/revision/latest?cb=20170422211131")
        defEmbed.setTitle("Definition for: " + res.word + ", ID: " + res.id)
        defEmbed.setURL(res.urbanURL)
        if (res.definition.length > 1024) {
            defEmbed.addField("Definition:", "Definition is too long, please use the link.")
        } else {
            defEmbed.addField("Definition:", res.definition)
        }
        defEmbed.addBlankField()
        if (res.example.length > 1024) {
            defEmbed.addField("Example:", "Example is too long, please use the link.")
        } else {
            defEmbed.addField("Example:", res.example)
        }
        defEmbed.addBlankField()
        defEmbed.addField("👍", res.thumbsUp, true)
        defEmbed.addField("👎", res.thumbsDown, true)
        defEmbed.setFooter("By \"" + res.author + "\"")
    message.channel.send(defEmbed)
}

exports.help = {
    name: "define",
    description: "Search the Urban Dictionary for a word. May be NSFW.",
    aliases: "urban, word",
    usage: "d!define <word>",
    cooldown: 5
}