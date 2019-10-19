exports.run = (client, message, args) => {
    message.channel.send("HERE'S THE LINK FOR MAKING ME JOIN YOUR SERVER: http://bit.ly/InviteDialgaBot. \nAND HERE'S THE LINK FOR MY DISCORD SERVER: https://discord.gg/WK73HGC"); 
}

exports.help = {
    name: "invite",
    description: "Provides the link for adding DialgaBot to your own server, or joining the DialgaBot server.",
    aliases: "addme",
    usage: "d!invite",
    cooldown: 10
}   