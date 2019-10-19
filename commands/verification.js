const sql = require("sqlite");
sql.open("./score.sqlite");

function roleSet (message) {
    var rArray = [];
    message.channel.send("OKAY, ENTER THE ROLES (CONFUSED? DO `d!verification info`)")
    var filterwtp = m => m.content;
    var setCollector = message.channel.createMessageCollector(filterwtp, { time: 30000 }) // 30s
    setCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        var items = content.split(",")
        items.forEach(element => {
            var elemente = element.trim()
            if (elemente.startsWith("<@&")) {
                var r = element.trim().slice(3, -1)

                var r1 = message.guild.roles.get(r)
                if (!r1) {
                    message.channel.send("THAT ROLE DOESN'T EXIST...");
                } else {
                    rArray.push(r)
                }
            } else {
                var r1 = message.guild.roles.find("name", element.trim());
    
                if (!r1) {
                    message.channel.send("THAT ROLE DOESN'T EXIST...");
                } else {
                    rArray.push(r1.id)
                }
            } 
        });
        if (rArray.length > 0) {
            sql.run("INSERT INTO 'verificationSys' (guildID, roleID, channelID, message, complete) VALUES (?, ?, ?, ?, ?)", [message.guild.id, rArray.join(), "-", "-", "NO"])
            setCollector.stop() 
            channelSet(message)
        }
    })

    setCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            })
        }
    })
}

function channelSet (message) {
    var cArray = [];
    message.channel.send("THANKS, NOW ENTER THE CHANNEL")
    var filterC = m => m.content;
    var seaCollector = message.channel.createMessageCollector(filterC, { time: 30000 }) // 30s
    seaCollector.on('collect', message => {
        if (message.author.bot) return;
        var seaContent = message.content
        if (seaContent.startsWith("<#")) {
            var c = seaContent.trim().slice(2, -1)

            var c1 = message.guild.channels.get(c);

            if (!c1) {
                return message.channel.send("THAT CHANNEL DOESN'T EXIST...");
            } else {
                cArray.push(c)
            }            

        } else {
            var c1 = message.guild.channels.find("name", seaContent.trim());

            if (!c1) {
                return message.channel.send("THAT CHANNEL DOESN'T EXIST...");
            } else {
                cArray.push(c1.id)
            }
        }

        if (cArray.length > 0) {
            sql.run("UPDATE 'verificationSys' SET channelID = ? WHERE guildID = ?", [cArray.join(), message.guild.id])
            seaCollector.stop()
            messageSet(message)
        }
    })

    seaCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            })
        }
    })
}

function messageSet (message) {
    var mArray = [];
    message.channel.send("ALRIGHT, NOW ENTER THE MESSAGE")
    var filterM = m => m.content;
    var mCollector = message.channel.createMessageCollector(filterM, { time: 30000 }) // 30s
    mCollector.on('collect', message => {
        if (message.author.bot) return;
        var mContent = message.content
        var m = mContent.trim()
        mArray.push(m)
        
        sql.run("UPDATE 'verificationSys' SET message = ?, complete = ? WHERE guildID = ?", [mArray.join(), "YES", message.guild.id]) 
        mCollector.stop()
        message.channel.send("OKAY, I'VE SET EVERYTHING UP NOW. YOU CAN CHECK IF EVERYTHING IS CORRECT WITH `d!verification check` AND DELETE IT WITH `d!verification delete`!")
    })

    mCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'verificationSys' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            })
        }
    })
}

exports.run = (client, message, args) => {
    if (!message.channel.permissionsFor(message.member).has("MANAGE_GUILD")) return message.channel.send("YOU CAN'T DO THAT!")

    if (args[0] === "set") {
        roleSet(message)
    } else if (args[0] == "info") {
        message.channel.send("```md\nHi, thanks for using the verification system with Dialga! To use this system correctly, I will need three things.\n# At least one Role ID for the newcomer to have, first one for the initial join, and any subsequent roles (optional) will be for after the verification\n# One channel ID for where the message will need to be sent\n# A message which needs to be sent in the channel, which is case sensitive\nAlso, for each toggle, there is 30 seconds for you to put the required details in. Otherwise, you'll need to restart from the beginning.\nFor a more in-depth explanation, you can go to the detailed help page, which is: https://dialgabot.gitbook.io/help/verification\n\nNow, if you're ready, you can do 'd!verification set'. Thanks! ```")
    } else if (args[0] == "delete") {
        sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) return message.channel.send("NOTHING IS SET.");
            sql.run("DELETE FROM 'verificationSys' WHERE guildID = ?", [message.guild.id])
            message.channel.send("I'VE DELETED IT.")
        })
    } else if (args[0] == "check") {
        sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) return message.channel.send("NOTHING IS SET.");
            var roles = row.roleID
            client.setTimeout(() => {
                var rolesA = roles.split(",")
                var rrArray = []
                for (a = 0; rolesA.length > a; a++) {
                    var r1 = message.guild.roles.get(rolesA[a].trim());
                    rrArray.push(" " + r1.name)
                }
                var isAre = "ROLE IS"
                if (rolesA.length > 1) var isAre = "ROLES ARE"
                var channelle = row.channelID
                client.setTimeout(() => {
                    var channell = message.guild.channels.get(channelle.trim());
                    message.channel.send(`CURRENTLY, THE ${isAre}:${rrArray} \nTHE CHANNEL IS #${channell.name} \nAND THE MESSAGE IS "${row.message}".`)
                }, 50);
            }, 50)
        })
    }
}

exports.help = {
    name: "verification",
    description: "Sets up the verification system. Feel free to ask for help setting this up.",
    aliases: "NONE",
    usage: "d!verification <set/info/delete/check>",
    cooldown: 30
}