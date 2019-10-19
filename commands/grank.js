const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

exports.run = (client, message, args, config, blacklist) => {

    sql.get("SELECT * FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]).then(row => {
	var testDisable = ""
        if (row) {
            testDisable = row.levelDisables
        }
        if (testDisable == "both" || testDisable == "local") return message.channel.send("IT APPEARS THAT THE SERVER HAS DISABLED THIS SERVER'S INVOLVEMENT IN GLOBAL LEADERBOARDS. THEREFORE, I CAN'T SHOW YOUR GLOBAL SCORE. SORRY ABOUT THAT.");

        if (args.length == 0) {
            var getScoreFrom = message.author.id
            if ((message.author.username).endsWith('s')) {
                var titleTS = message.author.username + "' score!"
            } else {
                var titleTS = message.author.username + "'s  score!"
            }
            var thumbTS = message.author.avatarURL
        } else {
            if (args[0].startsWith("<@")) {
                var getScoreFrom = message.mentions.users.array()[0].id
                if ((message.mentions.users.array()[0].username).endsWith('s')) {
                    var titleTS = message.mentions.users.array()[0].username + "' score!"
                } else {
                    var titleTS = message.mentions.users.array()[0].username + "'s  score!"
                }
                var thumbTS = message.mentions.users.array()[0].avatarURL
            } else {
                var scoreArgs = args.join(" ").trim()
                var memberTS = message.guild.members.find(member => (member.nickname || member.user.username) == scoreArgs);

                try {
                    var getScoreFrom = memberTS.id;
                    if ((memberTS.user.username).endsWith('s')) {
                        var titleTS = memberTS.user.username + "' score!"
                    } else {
                        var titleTS = memberTS.user.username + "'s  score!"
                    }
                    var thumbTS = memberTS.user.avatarURL;
                }
                catch(error) {
                    return message.channel.send("ERROR! THIS PROBABLY MEANS YOU PUT THE NAME IN WRONG.");
                }
            }
        }
        
        sql.get(`SELECT * FROM scores WHERE userId ="${getScoreFrom}"`).then(row => {
            if (!row) return message.channel.send("SCORE DATA DOESN'T SEEM TO EXIST... YET...");
            var curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
            var p1 = row.level + 1
            var p2 = p1 / 0.1
            var p3 = Math.pow(p2, 2)
            var p4 = p3 + 1
            var pointsReqForLvl = Math.ceil(p4 - row.points)
            if (pointsReqForLvl <= 0) var pointsReqForLvl = "NONE ACTUALLY"

            var pointsEmbed = new Discord.RichEmbed()
                .setTitle(titleTS)
                .addField("Points", row.points + "/" + Math.ceil(p4), true)
                .addField("Required to next Level", pointsReqForLvl, true)
                .addField("Level", row.level, true)
                .setThumbnail(thumbTS)
                .setColor([31, 128, 224])
            message.channel.send(pointsEmbed)
        });
    })
}

exports.help = {
    name: "grank",
    description: "Shows your (or someone else's) global rank",
    aliases: "gme, globalrank, globalme, gscore, globalscore",
    usage: "d!grank [@user]",
    cooldown: 5
}   