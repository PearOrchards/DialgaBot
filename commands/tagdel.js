const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

exports.run = (client, message, args, config, blacklist) => {
    var tagdeleter = message.author.id
    var inputTag = args[0]
    var outputTag = args.join(" ").slice(args[0].length).trim()

    sql.get("SELECT * FROM '" + tagdeleter + "' WHERE inputer = ?", [inputTag]).then(row => {
        if (!row) return message.channel.send("I DON'T SEE YOUR TAG... ARE YOUR ARGUMENTS COREECT?");
        sql.run("DELETE FROM '" + tagdeleter + "' WHERE inputer = ?", [inputTag])
        message.channel.send("DELETED IT FROM YOUR LIST OF TAGS!")
    })
}

exports.help = {
    name: "tagdel",
    description: "Deletes a tag",
    aliases: "tagremove, tagrm",
    usage: "d!tagdel <tag name>",
    cooldown: 15
}