exports.run = (client, message, args) => {
    if (args.join(" ").trim() == "") return message.channel.send("IT'D BE NICE IF YOU TOLD ME WHAT TO MAKE STUPID SOUNDING.");
    var hurr0 = args.join(" ").toLowerCase();
    var hurr1 = Array.from(hurr0)
    for(i in hurr1) {
        if(Math.floor(Math.random() * 2) + 1 == 1) {
            var a = hurr1[i].toUpperCase()
            hurr1.splice(i, 1, a)
        }
    }
    message.channel.send(hurr1.join(""))
}

exports.help = {
    name: "hurr",
    description: "MaKeS YoUr mEsSaGeS LoOk lIkE ThIs!\nBasically, make a message look like it's coming from an idiot.",
    aliases: "NONE",
    usage: "d!hurr <message>",
    cooldown: 5
}   