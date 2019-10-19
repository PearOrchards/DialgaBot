exports.run = (client, message, args) => {
        if (args.length != 0) {
            try {
                message.channel.send(message.mentions.users.array()[0].avatarURL);
            }
            catch(err) {
                message.channel.send("YOU DIDN'T TAG A PERSON!")
            } 
        }
        else {
            message.channel.send(message.author.avatarURL);
        }
    }

exports.help = {
    name: "avatar",
    description: "Get yours (or someone else's) avatar!",
    aliases: "pfp, picture",
    usage: "d!avatar [@user]",
    cooldown: 5
}