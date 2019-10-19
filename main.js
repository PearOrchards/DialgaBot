const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    disableEveryone: true
});
const fs = require("fs");
const config = require("./config.json");
const blacklist = require('./blacklist.json');
const wtpokes = require('./pokemon/pokedex.json')
const sql = require("sqlite");
sql.open("./score.sqlite"); 

const canGetScore = new Set();
var cmdCooldown = []

setInterval(() => {
    for (i in cmdCooldown) {
        var current = cmdCooldown[i].split(" ")
        var newtime = parseInt(current[1]) - 1
        if (newtime <= 0) { cmdCooldown.splice(i, 1) }
        else { cmdCooldown.splice(i, 1, (current[0] + " " + newtime.toString())) }
    }
}, 10)

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});
  
client.on("message", message => {
    if (message.channel.type === "dm") return; // Ignore DM channels.

    sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [message.guild.id]).then(row => {
        if (!row) return;
        let logFile = require(`./misc/logging.js`);
        logFile.run(client, message, row);
    })
    
    if (message.author.bot) return;
        
    if (!canGetScore.has(message.author.id)) {
        let lvlFile = require(`./misc/levelling.js`);
        lvlFile.run(client, message);
           
        canGetScore.add(message.author.id);
        client.setTimeout(() => {
            canGetScore.delete(message.author.id);
        }, 60000);
    }
    
    sql.get("SELECT * FROM 'verificationSys' WHERE channelID = ?", [message.channel.id]).then(row => {
        if (!row) return;
        if (row.complete == "NO") return;
        
            if (message.content == row.message) {
                var r1 = row.roleID.split(",");
                message.member.removeRole(r1[0]);
                r1.shift();
                for (i = 0; i < r1.length; i++) {
                    message.member.addRole(r1[i]);
                };
                message.delete();
            };
    });

    if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) return;

    //Below are commands without the prefix
    
    sArg = message.content.substring().toLowerCase();

    if (sArg.match(/\brip\b/i) || sArg.match(/\brlp\b/i)) {
        sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
            if (!row || row.rip == "true") {
                if (message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS", false)) {
                    message.react("☠");
                    message.react("💀");
                }
            }
        })
    }

    if (sArg.match(/\blit\b/i) || sArg.match(/\bfire\b/i)) {
        sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
            if (!row || row.lit == "true") {
                if (message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS", false)) {
                    message.react("🔥");
                }
            }
        })
    }

    if (sArg.match(/\bokay\b/i) || sArg.match(/\bwow\b/i) || sArg.match(/\bepic\b/i) || sArg.match(/\bbanter\b/i) || sArg.match(/\bok\b/i)) {
        sql.get("SELECT * FROM reactions WHERE serverID = ?", [message.guild.id]).then(row => {
            if (!row || row.okay == "true") {
                if (message.channel.permissionsFor(message.guild.me).has("ADD_REACTIONS", false)) {
                    message.react("👌");
                }
            }
        })
    }   

    if(message.content.indexOf(config.prefix) !== 0) return;
    
    for (item in cmdCooldown) if (cmdCooldown[item].split(" ")[0] == message.author.id && message.author.id != config.adminID) return message.channel.send(`WOAH THERE, YOU NEED TO COOL DOWN FIRST! (${parseInt(cmdCooldown[item].split(" ")[1]) / 100} second(s) remaining.)`);

    // Args defining
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase().replace(/\//g, ".")
  
    // File finding and running
    try {
        if (fs.existsSync(`./commands/${command}.js`)) {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args, config, blacklist, wtpokes);
            console.log(message.author.tag + " in " + message.guild.name + "/"+ message.channel.name + ": " + message.content)
            if (commandFile.help != undefined) cmdCooldown.push(message.author.id + " " + ((commandFile.help['cooldown'] + 1 )* 100).toString())
        } else {
            message.channel.send("UMM... I THINK YOU TYPED SOMETHING WRONG.");
        }
    } catch (err) {
        console.error(err)
    }
});

client.on('disconnect', function() {
    console.log("AAAAAAAAAAAA I WENT OFFLINE!")
    client.login(config.token);
});


client.setInterval(() => {
    sql.each("SELECT * FROM 'rt_times'", (err, row) => {
        try {
            if (row.TimeToUnmute < Date.now()) {
                var guildIDFetched = String(row.guildID)
                var guildFetched = client.guilds.get(guildIDFetched);
                var memberFetched = guildFetched.members.get(row.memberID);
                memberFetched.removeRole(row.roleID)
                sql.run("DELETE FROM 'rt_times' WHERE memberID = ?", [row.memberID])
            }
        } catch(err) {
            console.log(err)
        }
    })
}, 10000)

client.login(config.token);