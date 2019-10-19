const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

exports.run = (client, message, args, config, blacklist) => {
        var taglister = message.author.id
        var listOfTags = []
        sql.each("SELECT * FROM '" + taglister + "'", (err, row) => {
            listOfTags.push(
                row.inputer + " = " +
                row.outputer + "."
              );
        })
        var lister = client.setTimeout(() => {
        if (listOfTags.length === 0) {
            message.channel.send("I DON'T SEE ANY TAGS. DO YOU HAVE ANY?");
        } else {
            message.channel.send("HERE ARE YOUR TAGS.")
            message.channel.send(listOfTags)
            client.clearInterval(lister)
            }
        }, 10)
    }

exports.help = {
    name: "taglist",
    description: "Lists all of the tags that you have.",
    aliases: "tagall",
    usage: "d!taglist",
    cooldown: 20
}