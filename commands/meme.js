const randomPuppy = require('random-puppy');
const Discord = require("discord.js")
exports.run = (client, message, args, config, blacklist) => {

        subredditChooser = Math.floor(Math.random()*3) + 1;
            if (subredditChooser === 1) {
                    randomPuppy('meirl')
                    .then(url => {
                        var memeEmbed = new Discord.RichEmbed()
                            .setTitle('r/meirl')
                            .setImage(url)
                        message.channel.send(memeEmbed)
                })
            }

            else if (subredditChooser === 2) {
                    randomPuppy('wholesomememes')
                    .then(url => {
                        var memeEmbed = new Discord.RichEmbed()
                            .setTitle('r/wholesomememes')
                            .setImage(url)
                        message.channel.send(memeEmbed)
                })
            }

            else if (subredditChooser === 3) {
                    randomPuppy('dankmemes')
                    .then(url => {
                        var memeEmbed = new Discord.RichEmbed()
                            .setTitle('r/dankmemes')
                            .setImage(url)
                        message.channel.send(memeEmbed)
                })
            }
    }

exports.help = {
    name: "meme",
    description: "Pulls a meme from reddit. May be NSFW.",
    aliases: "plsmeme, ifunnycoisagoodwebsiteapparently",
    usage: "d!meme",
    cooldown: 3
}  