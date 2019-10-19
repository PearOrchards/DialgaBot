exports.run = (client, message, args, config) => {
    if (message.author.id !== config.adminID) return console.log("Beepity Boopity get off of my commandity");

    if (args[0].startsWith("%")) {
        var channel = client.channels.get(args[0].substring(1))
    } else return message.channel.send("CHANNEL MUST BE SPECIFIED! (%<channel>)");
    args.shift()
    if (args[0].startsWith("%")) {
        switch(args[0].substring(1)) {
            case "up":
                args.shift()
                var messageContent = args.join(" ").trim().toUpperCase()
                break;
            case "low":
                args.shift()
                var messageContent = args.join(" ").trim().toLowerCase()
                break;
        }
    } else var messageContent = args.join(" ").trim();
    channel.send(messageContent);
}