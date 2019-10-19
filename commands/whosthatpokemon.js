exports.run = (client, message, args, config, blacklist, wtpokes) => {
    let targetFile = require(`./wtp.js`);
    targetFile.run(client, message, args, config, blacklist, wtpokes);
}

exports.help = {
    name: "wtp",
    description: "Who's That Pokémon? Guess the Pokémon from a scrambled up combination of letters, and win points to defeat all of your friends in the leaderboard!",
    aliases: "whosthatpokemon, who'sthatpokemon",
    usage: "d!wtp <easy/normal/advanced/hard/master/impossible/multi/top>",
    cooldown: 3
}