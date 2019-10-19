exports.run = (client, message, args, config) => {
    if (message.author.id !== config.adminID) return console.log("Beepity Boopity get off of my commandity");

    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) return message.channel.send("I CAN'T DELETE MESSAGES. USE 'SAY' INSTEAD.");

        message.delete().then(function(msg) {
            var updateChannel = client.channels.get("455409689317081118")
            updateChannel.send(args.join(" ").trim());
            console.log(message.author.tag + " in " + message.channel.name + " in " + message.guild.name + ": " + message.content);            
        });
    }