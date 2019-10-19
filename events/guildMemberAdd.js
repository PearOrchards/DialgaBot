const sql = require("sqlite");
sql.open("./score.sqlite");

exports.run = (client, member) => {
    try { 
        var guildId = member.guild.id;

        sql.each("SELECT * FROM 'joinservertrigs' WHERE id = ?", [guildId], (err, row) => {
            if (row.t == "wic") {

                var mW00 = row.s
                var mW02 = mW00.split("+")
    
                var messageWelcome0 = mW02[1].trim().slice(2);
                
                var channelName = mW02[0].trim().slice(2);
    
                var messageWelcome = messageWelcome0.substr();
    
                var messageWelcome1 = messageWelcome.replace(/%user/gi, "<@" + member.id + ">");
                var messageWelcome2 = messageWelcome1.replace(/%guild/gi, member.guild.name);
    
                var welcomeChannel = client.channels.get(channelName);
                welcomeChannel.send(messageWelcome2);

            } else if (row.t == "wid") {

                var mW00 = row.s
                var mW02 = mW00.split("+")

                var messageWelcome0 = mW02[0].trim().slice(2);

                var messageWelcome = messageWelcome0.substr();
    
                var messageWelcome1 = messageWelcome.replace(/%user/gi, "<@" + member.id + ">");
                var messageWelcome2 = messageWelcome1.replace(/%guild/gi, member.guild.name);

                member.send(messageWelcome2)

            } else if (row.t == "r") {

                var mW00 = row.s
                var mW02 = mW00.split("+")

                var r = mW02[0].trim().slice(2);
                member.addRole(r)

            } else if (row.t == "rt") {

                var mW00 = row.s
                var mW02 = mW00.split("+")

                var r = mW02[0].trim().slice(2);
                var t = mW02[1].trim().slice(2);
                client.setTimeout(() => {
                    member.addRole(r)
                }, 100)
                
                sql.run("INSERT INTO 'rt_times' (guildID, memberID, roleID, TimeToUnmute) VALUES (?, ?, ?, ?)", [guildId, member.id, r, t * 1000 + Date.now()])

            } else if (row.t == "k") {

                var row = row.s;
                var row2 = row.split("+ ")
                row2.shift()
                var r;
                var dm;
                var tf = false;
                
                for (i = 0; i < row2.length; i++) {
                    var item = row2[i]

                    if (item.startsWith("r:")) {
                        var r = item.slice(2)
                    } 
                    if (item.startsWith("dm:")) {
                        var dm = item.slice(3)
                    } 
                    if (item.startsWith("ninc:")) {
                        var n = member.user.username;
                        if (n.includes(item.slice(5))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("nstart:")) {
                        var n = member.user.username;
                        if (n.startsWith(item.slice(6))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("nend:")) {
                        var n = member.user.username;
                        if (n.endsWith(item.slice(5))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("idmat:")) {
                        var id = member.user.id;
                        if (id == item.slice(6)) {
                            var tf = true;
                        }
                    }
                }

                if (tf === true) {
                    member.send(dm)
                    client.setTimeout(() => {
                        member.kick(r)
                    }, 1000);
                }

            } else if (row.t == "b") {

                var row = row.s;
                var row2 = row.split("+ ")
                row2.shift()
                var r;
                var dm;
                var tf = false;
                
                for (i = 0; i < row2.length; i++) {
                    var item = row2[i]

                    if (item.startsWith("r:")) {
                        var r = item.slice(2)
                    } 
                    if (item.startsWith("dm:")) {
                        var dm = item.slice(3)
                    } 
                    if (item.startsWith("ninc:")) {
                        var n = member.user.username;
                        if (n.includes(item.slice(5))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("nstart:")) {
                        var n = member.user.username;
                        if (n.startsWith(item.slice(6))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("nend:")) {
                        var n = member.user.username;
                        if (n.endsWith(item.slice(5))) {
                            var tf = true;
                        }
                    } 
                    if (item.startsWith("idmat:")) {
                        var id = member.user.id;
                        if (id == item.slice(6)) {
                            var tf = true;
                        }
                    }
                }

                if (tf === true) {
                    member.send(dm)
                    client.setTimeout(() => {
                        member.ban(r)
                    }, 1000);
                }

            }
        }); 
    } 
    catch(err) {
        console.log(err);
    }

    sql.get("SELECT * FROM 'verificationSys' WHERE guildID = ?", [guildId]).then(row => {
        if (!row) return;
        if (row.complete == "NO") return;

        var role = row.roleID.split(",")
        role.forEach(() => {
            member.addRole(role[0])
        });
    })
}