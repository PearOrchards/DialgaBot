function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

exports.run = (client, message, args, config, blacklist) => {
    if(message.author.id !== config.adminID) return;
    try {
        const code = args.join(" ");
        let evaled = eval(code);
        
        if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
        
        if (clean(evaled).length > 1995) {
            console.log(clean(evaled))
            message.channel.send("```OUTPUT TOO BIG TO SEND IN DISCORD, IT'S IN THE CONSOLE INSTEAD.```")
        } else {
            message.channel.send(clean(evaled), {code:"xl"});
        }
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}