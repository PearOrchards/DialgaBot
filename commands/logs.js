const sql = require("sqlite");
sql.open("./score.sqlite");

function channelSetLogs (message) {
    cArray = []
    message.channel.send("FIRST, ENTER THE CHANNEL.")
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
                if (!c1.permissionsFor(message.guild.me).has("SEND_MESSAGES", false)) {
                    return message.channel.send("I DO NOT HAVE THE PERMISSION TO SEND MESSAGES THERE.");
                } else {
                    cArray.push(c);
                }
            };
        } else {
            var c1 = message.guild.channels.find("name", seaContent.trim());

            if (!c1) {
                return message.channel.send("THAT CHANNEL DOESN'T EXIST...");
            } else {
                if (!c1.permissionsFor(message.guild.me).has("SEND_MESSAGES", false)) {
                    return message.channel.send("I DO NOT HAVE THE PERMISSION TO SEND MESSAGES THERE.");
                } else {
                    cArray.push(c);
                }
            };
        };

        if (cArray.length > 0) {
            sql.run("INSERT INTO 'loggingSettings' (guildID, channelID, messageStructure, settings, complete) VALUES (?, ?, ?, ?, ?)", [message.guild.id, cArray.join(), "-", "-", "NO"]);
            seaCollector.stop();
            messageStrucSet(message);
        };
    });

    seaCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            })
        }
    })
}

function messageStrucSet (message) {
    var mlArray = [];
    message.channel.send("OKAY, NOW ENTER THE MESSAGE STRUCTURE")
    var filterM = m => m.content;
    var mCollector = message.channel.createMessageCollector(filterM, { time: 30000 }) // 30s
    mCollector.on('collect', message => {
        if (message.author.bot) return;
        var mContent = message.content;
        var m = mContent.trim();
        mlArray.push(m);

        sql.run("UPDATE 'loggingSettings' SET messageStructure = ? WHERE guildID = ?", [mlArray.join(), message.guild.id]);
        mCollector.stop();
        settingsLSet(message)
    })

    mCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            });
        };
    });
};

function settingsLSet (message) {
    var setArray = [];
    message.channel.send("AND, DO YOU HAVE ANY EXTRA SETTINGS?");
    var filterS = m => m.content;
    var sCollector = message.channel.createMessageCollector(filterS, {time: 30000})
    sCollector.on('collect', message => {
        if (message.author.bot) return;
        var sContent = message.content;
        var settA = sContent.split(" ")

        for (ii = 0; ii < settA.length; ii++) {
            if (settA[ii] == "ignore_bots") {
                setArray.push("ig_bts")
            } else if (settA[ii] == "escape_tags") {
                setArray.push("esc_tgs")
            } else if (settA[ii] == "-") {
                setArray.push("empty")
            } else {
                return message.channel.send("THESE SETTING(S) AREN'T RECOGNISABLE.")
            };
        };

        if (setArray.length > 0) {
            sql.run("UPDATE 'loggingSettings' SET settings = ?, complete = ? WHERE guildID = ?", [setArray.join(), "YES", message.guild.id]);
            sCollector.stop();
            message.channel.send("ALRIGHT, I'VE SET EVERYTHING UP NOW. YOU CAN CHECK IF EVERYTHING IS CORRECT WITH `d!logs check` OR SIMPLY SEND A MESSAGE ANYWHERE, AND DELETE IT WITH `d!logs delete`!")
        };
    });

    sCollector.on('end', collected => {
        if (collected.size <= 1) {
            sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id]).then(row => {
                if (!row) return;
                sql.run("DELETE FROM 'loggingSettings' WHERE guildID = ?", [collected.first().guild.id])
                message.channel.send("TERMINATED SETUP DUE TO INACTIVITY.")
            });
        };
    });
};

exports.run = (client, message, args, config, blacklist) => {
    if(args[0] == "set") {
        if (!message.channel.permissionsFor(message.member).has("MANAGE_GUILD")) return message.channel.send("YOU CAN'T DO THAT!")

        channelSetLogs(message)
    } else if (args[0] == "check") {
        sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) return message.channel.send("THERE IS NOTHING SET");
            
            var c0 = row.channelID;
            var c =  message.guild.channels.get(c0.trim());

            message.channel.send(`THE CHANNEL IS #${c.name} \nTHE SETTINGS ARE ${row.settings} \nTHE STRUCTURE IS; \n${row.messageStructure}`)
        });
    } else if (args[0] == "delete") {
        sql.get("SELECT * FROM 'loggingSettings' WHERE guildID = ?", [message.guild.id]).then(row => {
            if (!row) return message.channel.send("NOTHING IS SET.");
            sql.run("DELETE FROM 'loggingSettings' WHERE guildID = ?", [message.guild.id])
            message.channel.send("I'VE DELETED IT.")
        })
    } else if (args[0] == "info") {
        message.channel.send("```md\nThe logging system in Dialga is used to be a way to capture every message that comes. Why would you do this? Because sometimes, people say harsh things, delete the message, and leaves staff and such clueless about what happened. To use this system, you need to have;\n# A channel\n# A message structure\n# A setting\nYou'll have 30 seconds to put each part in, or you'll have to restart\nThis is much deeper explained in the documentation, which is found here: https://dialgabot.gitbook.io/help/the-weird-stuff-to-explain/message-logs. \n\nOnce you're ready, you may start with using 'd!logs set'. Thanks!```")
    } else {
        message.channel.send("INVALID OPTION")
    }
}

exports.help = {
    name: "logs",
    description: "Changes or gives details on the logging system within DialgaBot.",
    aliases: "NONE",
    usage: "d!logs <set/delete/info>",
    cooldown: 30
}  