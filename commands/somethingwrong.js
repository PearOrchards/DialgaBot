exports.run = (client, message, args) => {
    message.channel.send("SORRY WHAT? I THINK YOU TYPED SOMETHING WRONG! GET BETTER AT TYPING");
};

exports.help = {
    name: "somethingwrong",
    description: "SORRY WHAT? I THINK YOU TYPED SOMETHING WRONG! GET BETTER AT TYPING",
    aliases: "NONE",
    usage: "d!somethingwrong",
    cooldown: 483
}