const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

exports.run = (client, message, args) => {
        var tagadder = message.author.id 
        var inputTag = args[0]
        var outputTag = args.join(" ").slice(args[0].length).trim()

        sql.run("CREATE TABLE IF NOT EXISTS '" + tagadder + "' (inputer TEXT, outputer TEXT)");
        var waiter = client.setTimeout(() => {
        sql.get("SELECT * FROM '" + tagadder + "' WHERE inputer = '" + inputTag + "'").then(row => {
            if (row === undefined) {
                sql.run("INSERT INTO '" + tagadder + "' (inputer, outputer) VALUES (?, ?)", [inputTag, outputTag]);
                message.channel.send("ADDED " + inputTag + ", WHICH GIVES " + outputTag + ".")
            } else {
                sql.run("UPDATE '" + tagadder + "' SET outputer = ? WHERE inputer = ?", [outputTag, inputTag]);
                message.channel.send("UPDATED " + inputTag + ", WHICH GIVES " + outputTag + ".")
            }
        })
        client.clearInterval(waiter)
        }, 10)
    }

exports.help = {
    name: "tagadd",
    description: "Adds a tag, with the text after the second space.",
    aliases: "tagmake",
    usage: "d!tagadd <tag name, no spaces> <text tag should display>",
    cooldown: 15
}