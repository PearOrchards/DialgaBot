const sql = require("sqlite");
const Discord = require("discord.js")
sql.open("./score.sqlite");

function whatPart (message) {
    message.channel.send("```SO... WHAT WOULD YOU LIKE TO CHANGE?\n[1] Level-up Message\n[2] Scores of specific users\n[3] Turn the system on/off for the guild for local and/or global scores\n[4] Set specific roles to not gain score/change all scores of people in the role\n[5] Nothing, I just wanted to see what was here.\n```")
    var filterPart = m => m.content
    var passPart = []
    var partCollector = message.channel.createMessageCollector(filterPart, { time: 60000 }) // 60s
    partCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        switch(content) {
            case "1":
                changeMessage(message);
                passPart.push("+");
                break;
            case "2":
                changeScoreID(message);
                passPart.push("+");
                break;
            case "3":
                changeState(message);
                passPart.push("+");
                break;
            case "4":
                changeRoles(message);
                passPart.push("+");
                break;
            case "5":
                nothing(message);
                passPart.push("+");
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

function changeMessage (message) {
    message.channel.send("```DO YOU WANT TO SET THE LEVEL MESSAGE OR DELETE IT?\n[1] Set\n[2] Delete```")
    var filterCM = m => m.content
    var passCM = []
    var cmCollector = message.channel.createMessageCollector(filterCM, { time: 60000 }) // 60s
    cmCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        switch(content) {
            case "1":
                setMessage(message);
                passCM.push("+");
                break;
            case "2":
                delMessage(message);
                passCM.push("+");
                break;
            default:
                message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```");
                break;
        };
        if (passCM.length > 0) {
            cmCollector.stop()
        }
    });

    cmCollector.on('end', collected => {
        if (passCM.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function setMessage(message) {
    sql.get("SELECT * FROM 'lvlmessages' WHERE guild = '" + message.guild.id + "'").then(row => {
        if (row) {
            message.channel.send("```WHAT WOULD YOU LIKE THE MESSAGE TO BE?```");
            var filterSM = m => m.content;
            var passSM = [];
            var smCollector = message.channel.createMessageCollector(filterSM, { time: 60000}); // 60s
            smCollector.on('collect', message => {
                if (message.author.bot) return;
                if (message.content == "") return message.channel.send("```SORRY, DIDN'T CATCH THAT.```");
                sql.run("UPDATE 'lvlmessages' SET message = ? WHERE guild ='" + message.guild.id + "'", [message.content]);
                message.channel.send(`\`\`\`DONE! I'VE SET THE MESSAGE TO "${message.content}"!\`\`\``);
                passSM.push("+");
                smCollector.stop();
            });
        } else {
            message.channel.send("```WHAT WOULD YOU LIKE THE MESSAGE TO BE?```");
            var filterSM = m => m.content;
            var passSM = [];
            var smCollector = message.channel.createMessageCollector(filterSM, { time: 60000}); // 60s
            smCollector.on('collect', message => {
                if (message.author.bot) return;
                if (message.content == "") return message.channel.send("```SORRY, DIDN'T CATCH THAT.```");
                sql.run("INSERT INTO 'lvlmessages' (guild, message) VALUES (?, ?)", [message.guild.id, message.content]);
                message.channel.send(`\`\`\`DONE! I'VE SET THE MESSAGE TO "${message.content}"!\`\`\``);
                passSM.push("+");
                smCollector.stop();
            });
        }

        smCollector.on('end', collected => {
            if (passSM.length == 0) {
                message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```");
            };
        });
    });
};

function delMessage(message) {
    sql.get("SELECT * FROM 'lvlmessages' WHERE guild = '" + message.guild.id + "'").then(row => {
        if (!row) return message.channel.send("```THERE IS NOTHING HERE ANYWAY.```");
        sql.run("DELETE FROM 'lvlmessages' WHERE guild = '" + message.guild.id + "'")
        message.channel.send("```I'VE DELETED IT, SORRY IF I ANNOYED YOU WITH MESSAGES OR SOMETHING...```")
    });
};

function changeScoreID(message) {
    message.channel.send("```WHO WOULD YOU LIKE TO CHANGE? PROVIDE A NAME OR MENTION THEM.```")
    var filterScore = m => m.content
    var passScore = []
    var scoreCollector = message.channel.createMessageCollector(filterScore, { time: 60000 }) // 60s
    scoreCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        if (content.startsWith("<@")) {
            var memberID = message.mentions.users.array()[0].id
        } else {
            var mI1 = content.trim()
            var mI2 = message.guild.members.find(member => (member.nickname || member.user.username) == mI1);

            try {
                var memberID = mI2.id;
            }
            catch(error) {
                return message.channel.send("```ERROR! THIS PROBABLY MEANS YOU PUT THE NAME IN WRONG.```");
            }
        }

        if (memberID) {
            sql.get(`SELECT * FROM '${message.guild.id}_score' WHERE userId = ?`, [memberID]).then(row => {
                if (!row) return message.channel.send("```THIS USER DOESN'T HAVE A SCORE!```")
                passScore.push("+")
                setTimeout(() => {
                    scoreCollector.stop();
                    changeScoreNum(message, memberID)
                }, 100);
            })
        }
    })

    scoreCollector.on('end', collected => {
        if (passScore.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```");
        };
    })
};

function changeScoreNum(message, memberID) {
    message.channel.send("```AND SO BY HOW MUCH WOULD YOU LIKE TO CHANGE THEIR SCORE BY?```")
    var filterScoreN = m => m.content
    var passScoreN = []
    var scoreNCollector = message.channel.createMessageCollector(filterScoreN, { time: 60000 }) // 60s
    scoreNCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        if (parseInt(content)) {
            sql.get(`SELECT * FROM '${message.guild.id}_score' WHERE userId = ?`, [memberID]).then(row => {
                if (!row) return message.channel.send("```HUH, NO ROW... I SWEAR I JUST CHECKED TO SEE IF THERE WAS ONE A SECOND AGO, AND THERE WAS...```")
                var curScore = row.points
                var changer = parseInt(content)
                var newScore = 0
                if (changer > 0 || changer < 0) {
                    var newScore = curScore + changer
                } else return message.channel.send("```THERE WAS NOTHING TO CHANGE, SO NOTHING WAS CHANGED```")
                
                var newLevel = Math.floor(0.2 * Math.sqrt(newScore * 2));
                sql.run(`UPDATE '${message.guild.id}_score' SET points = ?, level = ? WHERE userId = ?`, [newScore, newLevel, memberID])
                passScoreN.push("+")
                scoreNCollector.stop()
                message.channel.send("```DONE!```")
            })
        }
    })

    scoreNCollector.on('end', collected => {
        if (passScoreN.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```");
        }
    })
};

function changeState (message) {
    message.channel.send("```SO, WOULD YOU LIKE TO ENABLE ALL SCORES, OR DISABLE LOCAL SCORES, GLOBAL SCORES, OR BOTH SCORES?\n[1] Disable Local Scores\n[2] Disable Global Scores\n[3] Disable Both\n[4] Enable all```")
    var filterState = m => m.content
    var passState = []
    var stateCollector = message.channel.createMessageCollector(filterState, { time : 60000 }) // 60s
    stateCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        sql.get("SELECT * FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]).then(row => {
            if (!row) {
                switch(content) {
                    case "1":
                        sql.run("INSERT INTO 'levelDisabling' (serverID, levelDisables) VALUES (?, ?)", [message.guild.id, "local"]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```THE LOCAL SCORE SYSTEM HAS BEEN DISABLED. YOU CAN ENABLE IT AGAIN AT ANY TIME.```")
                        break;
                    case "2":
                        sql.run("INSERT INTO 'levelDisabling' (serverID, levelDisables) VALUES (?, ?)", [message.guild.id, "global"]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```THE GLOBAL SCORE SYSTEM HAS BEEN DISABLED. YOU CAN ENABLE IT AGAIN AT ANY TIME.```")
                        break;
                    case "3":
                        sql.run("INSERT INTO 'levelDisabling' (serverID, levelDisables) VALUES (?, ?)", [message.guild.id, "both"]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```ALL SCORE SYSTEMS HAVE BEEN DISABLED. YOU CAN ENABLE THEM AGAIN AT ANY TIME.```")
                        break;
                    case "4":
                        sql.run("DELETE FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```ALL SCORE SYSTEMS HAVE BEEN ENABLED. YOU CAN DISABLE IT AGAIN AT ANY TIME.```")
                        break;
                    default:
                        message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```")
                        break;
                }
            } else {
                switch(content) {
                    case "1":
                        sql.run("UPDATE 'levelDisabling' SET levelDisables = ? WHERE serverID = ?", ["local", message.guild.id]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```THE LOCAL SCORE SYSTEM HAS BEEN DISABLED. YOU CAN ENABLE IT AGAIN AT ANY TIME.```")
                        break;
                    case "2":
                        sql.run("UPDATE 'levelDisabling' SET levelDisables = ? WHERE serverID = ?", ["global", message.guild.id]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```THE GLOBAL SCORE SYSTEM HAS BEEN DISABLED. YOU CAN ENABLE IT AGAIN AT ANY TIME.```")
                        break;
                    case "3":
                        sql.run("UPDATE 'levelDisabling' SET levelDisables = ? WHERE serverID = ?", ["both", message.guild.id]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```ALL SCORE SYSTEMS HAVE BEEN DISABLED. YOU CAN ENABLE THEM AGAIN AT ANY TIME.```")
                        break;
                    case "4":
                        sql.run("DELETE FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]) // Don't mind the name, it's temporary
                        passState.push("+")
                        stateCollector.stop()
                        message.channel.send("```ALL SCORE SYSTEMS HAVE BEEN ENABLED. YOU CAN DISABLE IT AGAIN AT ANY TIME.```")
                        break;
                    default:
                        message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```")
                        break;
                }
            }
        })
    })

    stateCollector.on('end', collected => {
        if (passState.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    }) 
}

function changeRoles(message) {
    message.channel.send("```WHAT ROLE WOULD YOU LIKE TO CHANGE? YOU CAN GIVE AN ID, NAME, OR TAG IT.```")
    var passRoles = []
    var filterRoles = m => m.content
    var roleCollector = message.channel.createMessageCollector(filterRoles, { time : 60000 })
    roleCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        if (parseInt(content)) {
            var roleGotten = message.guild.roles.find(role => role.id === content)
            console.log("ID")
            passRoles.push("+")
            try {
                if (roleGotten.name == undefined) console.log("UNDEFINED ROLE IN LVLSETTINGS, SEC 4, ID ROUTE")
            } catch (error) {
                message.channel.send("```ERROR! DID YOU PUT IN THE RIGHT ID?```")
                passRoles.pop()
            }
        } else if (content.startsWith("<@")) {
            var trimmed = content.slice(3, -1)
            var roleGotten = message.guild.roles.find(role => role.id === trimmed)
            console.log("Tag")
            passRoles.push("+")
            try {
                if (roleGotten.name == undefined) console.log("UNDEFINED ROLE IN LVLSETTINGS, SEC 4, TAG ROUTE")
            } catch (error) {
                message.channel.send("```ERROR! DID YOU TAG THE ROLE CORRECLTY, AND BY ITSELF?```");
                passRoles.pop()
            }
        } else {
            var roleGotten = message.guild.roles.find(role => role.name === content)
            console.log("Name")
            passRoles.push("+")
            try {
                if (roleGotten.name == undefined) console.log("UNDEFINED ROLE IN LVLSETTINGS, SEC 4, NAME ROUTE")
            } catch (error) {
                message.channel.send("```ERROR! DID YOU PUT THE NAME CORRECTLY?```")
                passRoles.pop()
            }
        }

        if (passRoles.length > 0) {
            roleCollector.stop()
            changeRoles2(message, roleGotten)
        }
    })
    roleCollector.on('end', collected => {
        if (passRoles.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function changeRoles2(message, roleGotten) {
    message.channel.send("```WHAT WOULD YOU LIKE TO DO WITH THAT ROLE?\n[1] Enable gaining XP globally and locally (You can't enable only global or local, you have to disable one of them instead)\n[2] Disable gaining XP locally and/or globally```")
    var passRoles2 = []
    var filterRoles2 = m => m.content
    var roleCollector2 = message.channel.createMessageCollector(filterRoles2, { time: 30000 })
    roleCollector2.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        switch(content) {
            case "1": 
                sql.get("SELECT * FROM rolesState WHERE guildID = ?", [message.guild.id]).then(row => {
                    if (!row || row.stateOf == "on") return message.channel.send("```IT'S ALREADY ENABLED```");
                    else {
                        sql.run("UPDATE rolesState SET stateOf = ?, roleID = ? WHERE guildID = ?", ["on", roleGotten.id, message.guild.id])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS ENABLED.\`\`\``)
                        passRoles2.push("+")
                        roleCollector2.stop()
                    }
                })
                break;
            
            case "2":
                changeRolesDisable(message, roleGotten)
                passRoles2.push("+")
                roleCollector2.stop() 
                break;
            
            default:
                message.channel.send("```INCORRECT ARGUMENT, TRY AGAIN.```")
                break;
                
        }
    })

    roleCollector2.on('end', collected => {
        if (passRoles2.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function changeRolesDisable(message, roleGotten) {
    message.channel.send("```WOULD YOU LIKE TO DISABLE GAINING XP FOR THIS ROLE GLOBALLY, LOCALLY, OR BOTH?\n[1] Locally\n[2] Globally\n[3] Both```")
    var passCRD = []
    var filterCRD = m => m.content
    var crdCollector = message.channel.createMessageCollector(filterCRD, { time: 30000 })
    crdCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content
        switch(content) {
            case "1":
                sql.get("SELECT * FROM rolesState WHERE guildID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO rolesState (guildID, roleID, stateOf) VALUES (?, ?, ?)", [message.guild.id, roleGotten.id, "offlocal"])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED LOCALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    } else {
                        sql.run("UPDATE rolesState SET stateOf = ?, roleID = ? WHERE guildID = ?", ["offlocal", roleGotten.id, message.guild.id])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED LOCALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    }
                })
                break;
            
            case "2":
                sql.get("SELECT * FROM rolesState WHERE guildID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO rolesState (guildID, roleID, stateOf) VALUES (?, ?, ?)", [message.guild.id, roleGotten.id, "offglobal"])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED GLOBALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    } else {
                        sql.run("UPDATE rolesState SET stateOf = ?, roleID = ? WHERE guildID = ?", ["offglobal", roleGotten.id, message.guild.id])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED GLOBALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    }
                })
                break;

            case "3":
                sql.get("SELECT * FROM rolesState WHERE guildID = ?", [message.guild.id]).then(row => {
                    if (!row) {
                        sql.run("INSERT INTO rolesState (guildID, roleID, stateOf) VALUES (?, ?, ?)", [message.guild.id, roleGotten.id, "offall"])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED GLOBALLY AND LOCALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    } else {
                        sql.run("UPDATE rolesState SET stateOf = ?, roleID = ? WHERE guildID = ?", ["offall", roleGotten.id, message.guild.id])
                        message.channel.send(`\`\`\`GAINING XP FOR THE MEMBERS WITH THE ROLE "${roleGotten.name}" WAS DISABLED GLOBALLY AND LOCALLY.\`\`\``)
                        passCRD.push("+")
                        crdCollector.stop()
                    }
                })
                break;
        }
    })

    crdCollector.on('end', collected => {
        if (passCRD.length == 0) {
            message.channel.send("```I HAD NO CORRECT ARGUMENTS, TERMINATED THE MENU.```")
        }
    })
}

function nothing(message) {
    message.channel.send("```SO THAT WAS ALL THAT YOU DID.```")
}

exports.run = (client, message, args, config, blacklist) => {
    whatPart(message)
}