const sql = require("sqlite");
sql.open("./score.sqlite");

exports.run = (client, message, args) => {    
    if (message.channel.permissionsFor(message.member).has("MANAGE_GUILD")) {
        if (args[0] === "add") {

            if (args[1] === "wic") {

                var c = args[2].slice(2, -1)
                var m = args.join(" ").slice(args[0].length + args[1].length + args[2].length + 2); 
                if (m.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "wic", "c:" + c + "+ m:" + m]);
                message.channel.send("SET THE TRIGGER \"WELCOMING IN A CHANNEL\" WITH THE ARGUMENTS: CHANNEL: <#" + c + ">, MESSAGE: \"" + m + "\"")

            } else if (args[1] === "wid") {

                var m = args.join(" ").slice(args[0].length + args[1].length + 2);
                if (m.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "wid", "m:" + m])
                message.channel.send("SET THE TRIGGER \"WELCOMING IN A DM\" WITH THE ARGUMENTS: MESSAGE: \"" + m + "\"")

            } else if (args[1] === "r") {

                if (args[2].startsWith("<@&")) {
                    var r = args[2].slice(3, -1)
                    if (r.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                    sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "r", "r:" + r])

                    var roleFetcher = message.guild.roles.find(r);
                    message.channel.send("SET THE TRIGGER \"GIVE MEMBER A ROLE\" WITH THE ARGUMENTS: ROLE: \"" + roleFetcher.name + "\"")
                } else {
                    var r1 = message.guild.roles.find("name", args.join(" ").slice(args[0].length + args[1].length + 2));
                    if ((args.join(" ").slice(args[0].length + args[1].length + 2)).includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                    client.setTimeout(() => {
                        sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "r", "r:" + r1.id])
                        message.channel.send("SET THE TRIGGER \"GIVE MEMBER A ROLE\" WITH THE ARGUMENTS: ROLE: \"" + r1.name + "\"")
                    }, 10);
                }

            } else if (args[1] === "rt") {

                var t = parseInt(args[2])
                if(isNaN(t)) return message.channel.send("NOT A NUMBER!");
                if (args[3].startsWith("<@&")) {
                    var r = args[3].slice(3, -1)
                    if (r.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                    sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "rt", "r:" + r + "+ t:" + t])
                    var roleFetcher = message.guild.roles.find(r);
                    message.channel.send("SET THE TRIGGER \"GIVE MEMBER A ROLE\" WITH THE ARGUMENTS: ROLE: \"" + roleFetcher.name + "\", SECONDS: \"" + t * 1000 + "\"")
                } else {
                    var r1 = message.guild.roles.find("name", args.join(" ").slice(args[0].length + args[1].length + args[2].length + 3));
                    if ((args.join(" ").slice(args[0].length + args[1].length + 2)).includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                    client.setTimeout(() => {
                        sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "rt", "r:" + r1.id + "+ t:" + t])
                        message.channel.send("SET THE TRIGGER \"GIVE MEMBER A ROLE\" WITH THE ARGUMENTS: ROLE: \"" + r1.name + "\", SECONDS: \"" + t * 1000 + "\"")
                    }, 10);
                }

            } else if (args[1] === "k") {

                var kb1 = args.join(" ").slice(args[0].length + args[1].length + 2)
                if (kb1.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                var kb2 = kb1.split(" | ")
                var kFinal = ""

                for (i = 0; i < kb2.length; i++) {
                    var item = kb2[i]

                    if (item.startsWith("r:")) {
                        kFinal += ("+ " + item)
                    } else if (item.startsWith("ninc:")) {
                        kFinal += ("+ " + item)
                    } else if (item.startsWith("nstart:")) {
                        kFinal += ("+ " + item)
                    } else if (item.startsWith("nend:")) {
                        kFinal += ("+ " + item)
                    } else if (item.startsWith("idmat:")) {
                        kFinal += ("+ " + item)
                    } else if (item.startsWith("dm:")) {
                        kFinal += ("+ " + item)
                    }
                }

                sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "k", kFinal])
                message.channel.send("SET THE TRIGGER \"KICK IF\"")

            } else if (args[1] === "b") {

                var kb1 = args.join(" ").slice(args[0].length + args[1].length + 2)
                if (kb1.includes("+")) return message.channel.send("'+' SIGNS CAN'T BE USED. SORRY!")
                var kb2 = kb1.split(" | ")
                var bFinal = ""

                for (i = 0; i < kb2.length; i++) {
                    var item = kb2[i]

                    if (item.startsWith("r:")) {
                        bFinal += ("+ " + item)
                    } else if (item.startsWith("ninc:")) {
                        bFinal += ("+ " + item)
                    } else if (item.startsWith("nstart:")) {
                        bFinal += ("+ " + item)
                    } else if (item.startsWith("nend:")) {
                        bFinal += ("+ " + item)
                    } else if (item.startsWith("idmat:")) {
                        bFinal += ("+ " + item)
                    } else if (item.startsWith("dm:")) {
                        bFinal += ("+ " + item)
                    }
                }

                sql.run("INSERT INTO 'joinservertrigs' (id, t, s) VALUES (?, ?, ?)", [message.guild.id, "b", bFinal])
                message.channel.send("SET THE TRIGGER \"BAN IF\"")

            }

        } else if (args[0] === "list") {
            
            var noOfTrigs = 0
            var listOfTrigs = []
            sql.each("SELECT * FROM 'joinservertrigs' WHERE id = ?", [message.guild.id], (err, row) => {
                var idOfRow = row.n
                noOfTrigs++
                if(row.t === "wic") {
                    var mW00 = row.s
                    var mW02 = mW00.split("+")
                    
                    var messageWelcome0 = mW02[1].trim().slice(2);
                    
                    var channelName = mW02[0].trim().slice(2);
                    
                    var welcomeChannel = ("<#" + channelName + ">")
                    var messageWelcome = messageWelcome0

                    listOfTrigs.push("[" + noOfTrigs + "] " + "Welcome in Channel " + welcomeChannel + ", with the message: \"" + messageWelcome + "\"" + " -------- (" + idOfRow + ")")
                } else if(row.t === "wid") {

                    var mW00 = row.s
                    var mW02 = mW00.split("+")

                    var messageWelcome0 = mW02[0].trim().slice(2);

                    listOfTrigs.push("[" + noOfTrigs + "] " + "Welcome in DM, with the message: \"" + messageWelcome0 + "\"" + " -------- (" + idOfRow + ")")
                } else if(row.t === "r") {
                    var mW00 = row.s
                    var mW02 = mW00.split("+")

                    var r = mW02[0].trim().slice(2);
                    let r2 = message.guild.roles.get(r);
                    listOfTrigs.push("[" + noOfTrigs + "] " + "Adding the role: " + r2.name + " -------- (" + idOfRow + ")")
                } else if(row.t === "rt") {
                    var mW00 = row.s
                    var mW02 = mW00.split("+")

                    var r = mW02[0].trim().slice(2);
                    var t = mW02[1].trim().slice(2);

                    let r2 = message.guild.roles.get(r);
                    listOfTrigs.push("[" + noOfTrigs + "] " + "Adding the role: " + r2.name + ", for " + t + " seconds." + " -------- (" + idOfRow + ")")
                } else if(row.t === "k") {

                var row = row.s;
                var row2 = row.split("+ ")
                row2.shift()
                var reason;
                var dm;
                var listOfTrigsK = [];
                
                for (i = 0; i < row2.length; i++) {
                    var item = row2[i]

                    if (item.startsWith("r:")) {
                        var reason = item.slice(2)
                        listOfTrigsK.push("Reason: " + reason)
                    } 
                    if (item.startsWith("dm:")) {
                        var dm = item.slice(3)
                        listOfTrigsK.push("DM: " + dm)
                    } 
                    if (item.startsWith("ninc:")) {
                        listOfTrigsK.push("Name must include: " + item.slice(5))
                    } 
                    if (item.startsWith("nstart:")) {
                        listOfTrigsK.push("Name must start with: " + item.slice(6))
                    } 
                    if (item.startsWith("nend:")) {
                        listOfTrigsK.push("Name must start with: " + item.slice(5))
                    } 
                    if (item.startsWith("idmat:")) {
                        listOfTrigsK.push("ID must match: " + item.slice(6))
                    }
                }

                listOfTrigs.push("[" + noOfTrigs + "] " + "Kicking, which is triggered by; "  + listOfTrigsK + " -------- (" + idOfRow + ")")
                } else if(row.t === "b") {

                    var row = row.s;
                    var row2 = row.split("+ ")
                    row2.shift()
                    var reason;
                    var dm;
                    var listOfTrigsB = [];
                    
                    for (i = 0; i < row2.length; i++) {
                        var item = row2[i]
    
                        if (item.startsWith("r:")) {
                            var reason = item.slice(2)
                            listOfTrigsB.push(" Reason: \"" + reason + "\"")
                        } 
                        if (item.startsWith("dm:")) {
                            var dm = item.slice(3)
                            listOfTrigsB.push(" DM: \"" + dm + "\"")
                        } 
                        if (item.startsWith("ninc:")) {
                            listOfTrigsB.push(" Name must include: \"" + item.slice(5) + "\"")
                        } 
                        if (item.startsWith("nstart:")) {
                            listOfTrigsB.push(" Name must start with: \"" + item.slice(6) + "\"")
                        } 
                        if (item.startsWith("nend:")) {
                            listOfTrigsB.push(" Name must start with: \"" + item.slice(5) + "\"")
                        } 
                        if (item.startsWith("idmat:")) {
                            listOfTrigsB.push(" ID must match: \"" + item.slice(6) + "\"")
                        }
                    }
    
                    listOfTrigs.push("[" + noOfTrigs + "] " + "Banning, which is triggered by;"  + listOfTrigsB + " -------- (" + idOfRow + ")")
                }
        })
        client.setTimeout(() => {
            if (listOfTrigs.length != 0) {
                message.channel.send(listOfTrigs)
            } else {
                message.channel.send("THERE IS NOTHING SET FOR THIS GUILD.");
            }
        }, 1000)

        } else if(args[0] === "delete") {
        
            sql.get("SELECT * FROM 'joinservertrigs' WHERE n = ?", [args[1]]).then(row => {
                if (!row) {
                    message.channel.send("THAT ID DOESN'T EXIST.")
                } else {
                    if(row.id != message.guild.id) {
                        message.channel.send("THAT ID DOESN'T EXIST FOR YOUR SERVER .")
                    } else {
                        sql.run("DELETE FROM 'joinservertrigs' WHERE n = ?", [args[1]])
                        message.channel.send("DELETED SUCCESSFULLY!")
                    }
                }
            })
        
        }

    } else {
        message.channel.send("YOU CAN'T DO THAT.")
    } 
}

exports.help = {
    name: "jointriggers",
    description: "The system which DialgaBot can be automated to do something upon someone joining a server. If you need extra help, consult PKPear#2121, and he'll (probably) add extended help. You'll need it.",
    aliases: "onjoin",
    usage: "d!jointriggers <add/delete/list>",
    cooldown: 30
}   