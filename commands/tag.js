const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

exports.run = (client, message, args, config, blacklist) => {
        var taggetter = message.author.id
        var inputTag = args[0]
        var outputTag = args.join(" ").slice(args[0].length).trim()

        sql.get("SELECT * FROM '" + taggetter + "' WHERE inputer = ?", [inputTag]).then(row => {
            if (!row) return message.channel.send("I DON'T SEE YOUR TAG... DID YOU ADD IT?");
            message.channel.send(`${row.outputer}`);
         });
    }

exports.help = {
    name: "tag",
    description: "Shows a tag",
    aliases: "NONE",
    usage: "d!tag <tag name>",
    cooldown: 10
}