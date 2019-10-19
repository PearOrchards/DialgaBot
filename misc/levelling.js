const sql = require("sqlite");
sql.open("./score.sqlite");
var testDisable = ""

function globalXP (message) {
    var pointsToGet = Math.floor(Math.random() * 7) + 4;

        sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
            if (!row) {
                sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
            } else {
                let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
                if (curLevel > row.level) {
                    sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level + 1} WHERE userId = ${message.author.id}`);
                } else {
                    sql.run(`UPDATE scores SET points = ${row.points + pointsToGet} WHERE userId = ${message.author.id}`);
                }
            }
        }).catch(() => {
            console.error;
            sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
                sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
            });
        });
}

function localXP (message) {
    var pointsToGet = Math.floor(Math.random() * 5) + 5;

    sql.get("SELECT * FROM '" + message.guild.id + "_score' WHERE userId = " + message.author.id).then(row => {
        if (!row) {
            sql.run("INSERT INTO '" + message.guild.id + "_score' (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        } else {
            let curLevel = Math.floor(0.2 * Math.sqrt(row.points * 2));
            if (curLevel > row.level) {
                sql.run("UPDATE '" + message.guild.id + "_score' SET points = " + (row.points + 1) + ", level = " + (row.level + 1) + " WHERE userId =" + message.author.id);
                var guildId = message.guild.id;
            
                sql.get("SELECT * FROM 'lvlmessages' WHERE guild = ?", [guildId]).then(row => {
                    if (!row) return;
                    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;
                    var messagelvl0 = row.message;
                
                    var messagelvl = messagelvl0.substr();
                
                    var messagelvl1 = messagelvl.replace(/%user/gi, "<@" + message.author.id + ">");
                    var messagelvl2 = messagelvl1.replace(/%guild/gi, message.guild.name);
                    var messagelvl3 = messagelvl2.replace(/%level/gi, curLevel);
                    message.channel.send(messagelvl3);
                });
            };
            sql.run("UPDATE '" + message.guild.id + "_score' SET points = " + (row.points + pointsToGet) + " WHERE userId = " + message.author.id)
        }
    }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS '" + message.guild.id + "_score' (userId TEXT, points INTEGER, level INTEGER)").then(() => {
            sql.run("INSERT INTO '" + message.guild.id + "_score' (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
        });
    });
}

exports.run = (client, message) => { 

    //Global XP 
    sql.get("SELECT * FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]).then(row => {
        if (row) {
            testDisable = row.levelDisables
        }
        if (testDisable == "both" || testDisable == "global") return;
        sql.get("SELECT * FROM 'rolesState' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) { // check if any role is role is being filtered. If no, automatically go to give the people the score. else...
                globalXP(message)
            } else {
                if (message.member.roles.has(row.roleID)) { // does the guy have the role in question? if yeah, more testing, if not, they get score
                    if (row.stateOf == "offglobal" || row.stateOf == "offall") { // is the server disabling the specific system or both? 
                        // nothing happens :)
                    } else {
                        globalXP(message)
                    }
                } else {
                    globalXP(message)
                } 
            }  
        })
    })


    //Local XP
    sql.get("SELECT * FROM 'levelDisabling' WHERE serverID = ?", [message.guild.id]).then(row => {
        if (row) {
            testDisable = row.levelDisables
        }
        if (testDisable == "both" || testDisable == "local") return;
        sql.get("SELECT * FROM 'rolesState' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) { // check if any role is role is being filtered. If no, automatically go to give the people the score. else...
                localXP(message)
            } else {
                if (message.member.roles.has(row.roleID)) { // does the guy have the role in question? if yeah, more testing, if not, they get score
                    if (row.stateOf == "offlocal" || row.stateOf == "offall") { // is the server disabling the specific system or both? 
                        // nothing happens :)
                    } else {
                        localXP(message)
                    }
                } else {
                    localXP(message)
                } 
            }  
        })
    })
}