exports.run = (client, message, args, config, blacklist) => {
    if (message.author.id === "137652130084290560") {
        var GameToSet = args.join(" ").trim();
        client.user.setActivity(GameToSet);
    } else {
        message.channel.send("I'M AFRAID YOU CAN'T DO THAT.")
    }
}