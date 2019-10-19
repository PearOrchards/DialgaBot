exports.run = (client, message, args) => {
    if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) return message.channel.send("MISSING THE PERMISSIONS TO DO THAT.");
    if (!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES")) return message.channel.send("YOU DON'T HAVE THE CORRECT PERMISSIONS!")
    if (parseInt(args[0])) {
            message.delete().then(message => {
                message.channel.bulkDelete(parseInt(args[0  ]))
            });
        } else {
            message.channel.send("HEY IT MUST BE A NUMBER!")
        }
    }

exports.help = {
    name: "purge",
    description: "Deletes 2 - 200 messages at once, if they're not over 14 days old.",
    aliases: "clear, wipe",
    usage: "d!purge <number of messages to delete>",
    cooldown: 5
}  