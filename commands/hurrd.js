exports.run = (client, message, args, config, blacklist) => {
    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) return message.channel.send("I CAN'T DELETE MESSAGES. USE 'HURR' INSTEAD.");
    if (args.join(" ").trim() == "") return message.channel.send("IT'D BE NICE IF YOU TOLD ME WHAT TO MAKE STUPID SOUNDING.");
            message.delete().then(function(msg) {
            var hurr0 = args.join(" ").toLowerCase();
            var hurr1 = Array.from(hurr0)
            for(i in hurr1) {
                if(Math.floor(Math.random() * 2) + 1 == 1) {
                    var a = hurr1[i].toUpperCase()
                    hurr1.splice(i, 1, a)
                }
            }
            message.channel.send(hurr1.join(""))
        });
    }

exports.help = {
    name: "hurrd",
    description: "MaKeS YoUr mEsSaGeS LoOk lIkE ThIs!\nBasically, make a message look like it's coming from an idiot, but then the commanding message gets deleted!",
    aliases: "hurrdel, hurrdelete",
    usage: "d!hurrd <message>",
    cooldown: 5
}   