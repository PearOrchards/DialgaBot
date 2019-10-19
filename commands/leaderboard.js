const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

function playerRankGrabber(message, leaderboardConstruction, listModifier) {
    var playerRnk = []
    var position = 1
    sql.each("SELECT * FROM '" + message.guild.id + "_score' ORDER BY points DESC", (err, row) => {
        if (message.author.id != row.userId) {
            position++
        } else {
            playerRnk.push(
                "Your Rank:\n" +
                `[${position}] ` + message.author.username +
                "\n         Points: " + row.points +
                "\n           Lvl: " + row.level
            )
            pusher(message, leaderboardConstruction, listModifier, playerRnk);
        }
    });
}

function pusher(message, leaderboardConstruction, listModifier, playerRnk) {
    for (i = 0; i < (listModifier - 10); i++) {
        leaderboardConstruction.shift()
        if (i == listModifier - 10) sender(message, leaderboardConstruction, playerRnk);
    }
    if (i == listModifier - 10) sender(message, leaderboardConstruction, playerRnk);
}

function sender(message, leaderboardConstruction, playerRnk) {
    if (leaderboardConstruction.length == 0) return message.channel.send("PAGE NOT FOUND.");
    message.channel.send(`**LEADERBOARD FOR ${message.guild.name.toUpperCase()}** \n \`\`\`css\n${leaderboardConstruction}\n---------------------------------------\n${playerRnk}\`\`\``)
}

exports.run = (client, message, args, config, blacklist) => {
    sql.get("SELECT * FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]).then(row => {
        var testDisable = ""
        if (row) {
            testDisable = row.levelDisables
        }
        if (testDisable == "both" || testDisable == "local") return message.channel.send("IT APPEARS THAT THE SERVER HAS DISABLED THE LOCAL SCORING SYSTEM. THEREFORE, I CAN'T SHOW YOU THE LEADERBOARD. SORRY ABOUT THAT.");

        var listModifier = 10
        if (parseInt(args[0])) var listModifier = parseInt(args[0]) * 10
        var leaderboardConstruction = []
        var position = 0
        sql.each("SELECT * FROM '" + message.guild.id + "_score' ORDER BY points DESC LIMIT ?", [listModifier], (err, row) => {
            position++
            if (!row) {}
            else {
                var userID = row.userId
                var userProfile = client.users.get(userID)
                var userName = "Name failed to fetch"

                if (userProfile == null) {var userName = `ID: '${userID}'`}
                else {var userName = `${userProfile.username}`}

                leaderboardConstruction.push(
                    "\n" +
                    `[${position}] ` + userName +
                    "\n         Points: " + row.points +
                    "\n           Lvl: " + row.level
                )
            }
        });

        setTimeout(() => {
            playerRankGrabber(message, leaderboardConstruction, listModifier)
        }, 500);
    })
};

exports.help = {
    name: "leaderboard",
    description: "Shows the server's leaderboard.",
    aliases: "top",
    usage: "d!leaderboard [page]",
    cooldown: 15
}  