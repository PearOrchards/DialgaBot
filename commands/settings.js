exports.run = (client, message, args, config, blacklist) => {
    if (!message.channel.permissionsFor(message.member).has("MANAGE_GUILD")) return message.channel.send("```MANAGE_GUILD PERMISSION REQUIRED FOR YOU TO DO THAT```")
    message.channel.send("```SETTINGS... RIGHT, WHICH SECTION WOULD YOU LIKE TO GO TO? \n[1] General Settings\n[2] Level Settings\n[3] Nothing```");
    var filterPart = m => m.content;
    var passPart = [];
    var partCollector = message.channel.createMessageCollector(filterPart, { time: 60000 }); // 60s
    partCollector.on('collect', message => {
        if (message.author.bot) return;
        var content = message.content;
        switch(content) {
            case "1":
                let generalSettings = require(`../misc/gensettings.js`);
                generalSettings.run(client, message, args, config, blacklist);
                passPart.push("+")
                break;
            
            case "2":
                let levelSettings = require(`../misc/lvlsettings.js`);
                levelSettings.run(client, message, args, config, blacklist);
                passPart.push("+")
                break;

            case "3":
                message.channel.send("```SO THAT WAS ALL THAT YOU DID.```")
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

exports.help = {
    name: "settings",
    description: "Change how DialgaBot works in your server.",
    aliases: "NONE",
    usage: "d!settings",
    cooldown: 30
}