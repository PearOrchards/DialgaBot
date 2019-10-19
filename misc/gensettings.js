const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

function whatPartGen(message) {
    message.channel.send("```SO... WHAT WOULD YOU LIKE TO CHANGE?\n[1] Enable/Disable Reactions \n[2] Check Reactions \n[3] Nothing, I just wanted to see what was here.```")
    var filterPart = m => m.content
    var passPart = []
    var partCollector = message.channel.createMessageCollector(filterPart, { time: 60000 }) // 60s
    partCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        switch(content) {
            case "1":
                changeReactions1(message)
                passPart.push("+")
                break;

            case "2":
                checkReactState(message)
                passPart.push("+")
                break;

            case "3":
                nothing(message)
                passPart.push("+")
                break;

            default:
                message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```")
                break;
            }
        if (passPart.length > 0) {
            partCollector.stop()
        }   
    })

    partCollector.on('end', collected => {
        if (passPart.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function changeReactions1(message) {
    message.channel.send("```WHAT REACTIONS WOULD YOU LIKE TO CHANGE?\n[1] RIP\n[2] Fire\n[3] ok_hand```")
    var filterReactions = m => m.content
    var passFR = []
    var frCollector = message.channel.createMessageCollector(filterReactions, { time : 60000})
    frCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        switch(content) {
            case "1":
                sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO reactions (serverID, rip, lit, okay) VALUES (?, ?, ?, ?)", [message.guild.id, "false", "true", "true"])
                        message.channel.send("THE 'RIP' TRIGGER WAS DISABLED")
                    } else {
                        if (row.rip == "true") {
                            sql.run("UPDATE reactions SET rip = ? WHERE serverID = ?", ["false", message.guild.id])
                            message.channel.send("THE 'RIP' TRIGGER WAS DISABLED")
                        } else {
                            sql.run("UPDATE reactions SET rip = ? WHERE serverID = ?", ["true", message.guild.id])
                            message.channel.send("THE 'RIP' TRIGGER WAS ENABLED") 
                        }
                    }
                })
                passFR.push("+")
                break;
            case "2":
                sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO reactions (serverID, rip, lit, okay) VALUES (?, ?, ?, ?)", [message.guild.id, "true", "false", "true"])
                        message.channel.send("THE 'LIT' TRIGGER WAS DISABLED")
                    } else {
                        if (row.lit == "true") {
                            sql.run("UPDATE reactions SET lit = ? WHERE serverID = ?", ["false", message.guild.id])
                            message.channel.send("THE 'LIT' TRIGGER WAS DISABLED")
                        } else {
                            sql.run("UPDATE reactions SET lit = ? WHERE serverID = ?", ["true", message.guild.id])
                            message.channel.send("THE 'LIT' TRIGGER WAS ENABLED") 
                        }
                    }
                })
                passFR.push("+")
                break;
            case "3":
                sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO reactions (serverID, rip, lit, okay) VALUES (?, ?, ?, ?)", [message.guild.id, "true", "true", "false"])
                        message.channel.send("THE 'OKAY' TRIGGER WAS DISABLED")
                    } else {
                        if (row.okay == "true") {
                            sql.run("UPDATE reactions SET okay = ? WHERE serverID = ?", ["false", message.guild.id])
                            message.channel.send("THE 'OKAY' TRIGGER WAS DISABLED")
                        } else {
                            sql.run("UPDATE reactions SET okay = ? WHERE serverID = ?", ["true", message.guild.id])
                            message.channel.send("THE 'OKAY' TRIGGER WAS ENABLED") 
                        }
                    }
                })
                passFR.push("+")
                break;
            
            default:
                message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```")
                break;
        }
        if (passFR.length > 0) {
            frCollector.stop()
        }
    })

    frCollector.on('end', collected => {
        if (passFR.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function checkReactState(message) {
    sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
        if (!row) return message.channel.send("YOU HAVEN'T CHANGE ANYTHING, SO ALL REACTIONS ARE ON.")
        if (row.rip == "true") {
            var ripState = "ON"
        } else {
            var ripState = "OFF"
        }

        if (row.lit == "true")  {
            var litState = "ON"
        } else {
            var litState = "OFF"
        }

        if (row.okay == "true")  {
            var okayState = "ON"
        } else {
            var okayState = "OFF"
        }

        message.channel.send(`RIP IS CURRENTLY ${ripState}\nLIT IS CURRENTLY ${litState}\nOKAY STATE IS CURRENTLY ${okayState}`)
    })
}

function nothing(message) {
    message.channel.send("SO THAT WAS ALL THAT YOU DID.")
}

exports.run = (client, message, args, config, blacklist) => {
    whatPartGen(message)
}