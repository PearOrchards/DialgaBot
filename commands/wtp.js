const sql = require("sqlite");
sql.open("./score.sqlite"); 
const wtpAlreadyRunning = new Set();
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};

function shuffler(original) {
    var shuffled = original.shuffle()
    if (shuffled == original) return shuffler(original)
    else return shuffled;
}

var generationIDs = {
    "1": "1,151",
    "2": "152,251",
    "3": "252,386",
    "4": "387,493",
    "5": "494,649",
    "6": "650,721",
    "7": "722,809"
};

var difficultyWeight = {
    "e": 2,
    "n": 3,
    "a": 6,
    "h": 7,
    "m": 10
}

function pokemonSelector(pokesAllowed, wtpokes) {
    var splitAllowed = pokesAllowed.split(",")
    var min = parseInt(splitAllowed[0])
    var max = parseInt(splitAllowed[1])
    var pokemonSelected = Math.floor(Math.random() * (max - min + 1)) + min;
    for (i = 0; i < wtpokes.length; i++) {
        if (wtpokes[i].id == pokemonSelected) {
            return wtpokes[i].name.english;
        }
    }
};

function wtpLeaderboardHandler(message, difficulty) {
    var userID = message.member.id
    var weight = difficultyWeight[difficulty]
    sql.get("SELECT * FROM wtpExcluded WHERE userID = ?", [userID]).then(row => {
        if (row) return;
        sql.get("SELECT * FROM wtpLeaderboard WHERE userID = ?", [userID]).then(row => {
            if (!row) {
                sql.run("INSERT INTO wtpLeaderboard VALUES (?,?)", [userID, weight])
            } else {
                var currScore = row.score
                var newScore = currScore + weight
                sql.run("UPDATE wtpLeaderboard SET score = ? WHERE userID = ?", [newScore, userID])
            }
        })
    })
}

function easyDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element));
    });
    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "`. YOU HAVE 30 SECONDS TO GUESS THE RIGHT POKÉMON.");

    var wtpCompletedE = [];
    var filterwtp = m => m.content;
    var wtpListenerE = message.channel.createMessageCollector(filterwtp, { time: 30000 });
    wtpListenerE.on('collect', message => {
        if (message.author.bot) return;
        if (message.content.trim().toLowerCase() === allPokes[0].toLowerCase()) {
            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`.");
            wtpCompletedE.push("+"); wtpListenerE.stop(); wtpAlreadyRunning.delete(message.guild.id);
            wtpLeaderboardHandler(message, "e")
        };
    });
    wtpListenerE.on('end', collected => {
        if (wtpCompletedE.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS ``" + allPokes[0] + "``.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function normalDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element).toLowerCase());
    });
    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "`. YOU HAVE 15 SECONDS TO GUESS THE RIGHT POKÉMON.");
    
    var wtpCompletedN = [];
    var filterwtp = m => m.content;
    var wtpListenerN = message.channel.createMessageCollector(filterwtp, { time: 15000 });
    wtpListenerN.on('collect', message => {
        if (message.author.bot) return;
        if (message.content.trim().toLowerCase() === allPokes[0].toLowerCase()) {
            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`.");
            wtpCompletedN.push("+"); wtpListenerN.stop(); wtpAlreadyRunning.delete(message.guild.id);
            wtpLeaderboardHandler(message, "n")
        };
    });
    wtpListenerN.on('end', collected => {
        if (wtpCompletedN.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS ``" + allPokes[0] + "``.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function advDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element));
    });
    message.channel.send("THE POKÉMON ARE `" + allPokesShuffled[0] + "` AND `" + allPokesShuffled[1] + "`. YOU HAVE 20 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2>, <POKÉMON 1/2>`)");

    var allPokesLower = allPokes.map(v => v.toLowerCase());
    
    var wtpCompletedA = [];
    var filterwtp = m => m.content;
    var wtpListenerA = message.channel.createMessageCollector(filterwtp, { time: 20000 });
    wtpListenerA.on('collect', message => {
        if (message.author.bot) return;
        answerA = message.content.trim().split(",")
        if (answerA.length != 2) return message.channel.send("DID YOU PUT TWO POKÉMON SPLIT BY A COMMA THERE?");
        if (allPokesLower.includes(answerA[0].trim().toLowerCase()) && allPokesLower.includes(answerA[1].trim().toLowerCase())) {
            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.");
            wtpCompletedA.push("+"); wtpListenerA.stop(); wtpAlreadyRunning.delete(message.guild.id);
            wtpLeaderboardHandler(message, "a")
        }

    });
    wtpListenerA.on('end', collected => {
        if (wtpCompletedA.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function hardDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element).toLowerCase());
    });
    message.channel.send("THE POKÉMON ARE `" + allPokesShuffled[0] + "` AND `" + allPokesShuffled[1] + "`. YOU HAVE 10 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2>, <POKÉMON 1/2>`)");

    var allPokesLower = allPokes.map(v => v.toLowerCase());
    
    var wtpCompletedH = [];
    var filterwtp = m => m.content;
    var wtpListenerH = message.channel.createMessageCollector(filterwtp, { time: 10000 });
    wtpListenerH.on('collect', message => {
        if (message.author.bot) return;
        answerH = message.content.trim().split(",")
        if (answerH.length != 2) return message.channel.send("DID YOU PUT TWO POKÉMON SPLIT BY A COMMA THERE?");
        if (allPokesLower.includes(answerH[0].trim().toLowerCase()) && allPokesLower.includes(answerH[1].trim().toLowerCase())) {
            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.");
            wtpCompletedH.push("+"); wtpListenerH.stop(); wtpAlreadyRunning.delete(message.guild.id);
            wtpLeaderboardHandler(message, "h")
        }

    });
    wtpListenerH.on('end', collected => {
        if (wtpCompletedH.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function masterDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element).toLowerCase());
    });
    message.channel.send("THE POKÉMON ARE `" + allPokesShuffled[0] + "`, `" + allPokesShuffled[1] + "` AND `" + allPokesShuffled[2] + "`. YOU HAVE 15 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2/3>, <POKÉMON 1/2/3>, <POKÉMON 1/2/3>`)");

    var allPokesLower = allPokes.map(v => v.toLowerCase());
    
    var wtpCompletedM = [];
    var filterwtp = m => m.content;
    var wtpListenerM = message.channel.createMessageCollector(filterwtp, { time: 15000 });
    wtpListenerM.on('collect', message => {
        if (message.author.bot) return;
        answerM = message.content.trim().split(",")
        if (answerM.length != 3) return message.channel.send("DID YOU PUT THREE POKÉMON SPLIT BY A COMMA THERE?");
        if (allPokesLower.includes(answerM[0].trim().toLowerCase()) && allPokesLower.includes(answerM[1].trim().toLowerCase()) && allPokesLower.includes(answerM[2].trim().toLowerCase())) {
            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.");
            wtpCompletedM.push("+"); wtpListenerM.stop(); wtpAlreadyRunning.delete(message.guild.id);
            wtpLeaderboardHandler(message, "m")
        }

    });
    wtpListenerM.on('end', collected => {
        if (wtpCompletedM.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function impDiff(pokesAllowed, wtpokes, message) {
    var allPokes = [];
    var allPokesShuffled = [];
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
    allPokes.forEach(element => {
        allPokesShuffled.push(shuffler(element).toLowerCase());
    });
    message.channel.send("THE POKÉMON ARE `" + allPokesShuffled[0] + "`, `" + allPokesShuffled[1] + "` AND `" + allPokesShuffled[2] + "`. YOU HAVE 5 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2/3>, <POKÉMON 1/2/3>, <POKÉMON 1/2/3>`)");
    
    message.channel.startTyping()
    setTimeout(() => {
        message.channel.send(allPokes[0].toUpperCase() + ", " + allPokes[1].toUpperCase() + ", " + allPokes[2].toUpperCase())
        message.channel.send("`DialgaBot` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.");
        wtpCompletedM.push("+"); wtpListenerM.stop(); wtpAlreadyRunning.delete(message.guild.id);
        message.channel.stopTyping()
    }, 1500);
    var wtpCompletedM = [];
    var filterwtp = m => m.content;
    var wtpListenerM = message.channel.createMessageCollector(filterwtp, { time: 5000 });
    wtpListenerM.on('collect', message => {
        if (message.author.bot) return;
        message.channel.send("NOT CHECKING, TOO BUSY FIGURING IT OUT MYSELF")
    });
    wtpListenerM.on('end', collected => {
        if (wtpCompletedM.length == 0) {
            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.");
            wtpAlreadyRunning.delete(message.guild.id);
        };
    });
};

function playerRankGrabber(message, leaderboardConstruction, listModifier) {
    console.log("func2")
    var playerRnk = []
    var position = 1
    sql.each("SELECT * FROM wtpLeaderboard ORDER BY score", (err, row) => {
        if (message.author.id != row.userID) {
            position++
        } else {
            playerRnk.push(
                "Your Rank:\n" +
                `[${position}] ` + message.author.username +
                "\n         Points: " + row.score
            )
            pusher(message, leaderboardConstruction, listModifier, playerRnk);
        }
    });
}

function pusher(message, leaderboardConstruction, listModifier, playerRnk) {
    console.log("func3")
    for (i = 0; i < (listModifier - 10); i++) {
        leaderboardConstruction.shift()
        if (i == listModifier - 10) sender(message, leaderboardConstruction, playerRnk);
    }
    if (i == listModifier - 10) sender(message, leaderboardConstruction, playerRnk);
}

function sender(message, leaderboardConstruction, playerRnk) {
    console.log("func4")
    if (leaderboardConstruction.length == 0) return message.channel.send("PAGE NOT FOUND.");
    message.channel.send(`**LEADERBOARD FOR ${message.guild.name.toUpperCase()}** \n \`\`\`css\n${leaderboardConstruction}\n---------------------------------------\n${playerRnk}\`\`\``)
}

function leaderboardShower(client, message, args) {
    console.log("func1")
    var listModifier = 10
    if (parseInt(args[1])) var listModifier = parseInt(args[1]) * 10
    var leaderboardConstruction = []
    var position = 0
    sql.each("SELECT * FROM wtpLeaderboard ORDER BY score DESC LIMIT ?", [listModifier], (err, row) => {
        position++
        if (!row) {}
        else {
            var userId = row.userID
            var userProfile = client.users.get(userId)
            var userName = "Name failed to fetch"

            if (userProfile == null) {var userName = `ID: '${userId}'`}
            else {var userName = `${userProfile.username}`}

            leaderboardConstruction.push(
                "\n" +
                `[${position}] ` + userName +
                "\n         Points: " + row.score
            )
        }
    });

    setTimeout(() => {
        playerRankGrabber(message, leaderboardConstruction, listModifier)
    }, 500);
}

exports.run = (client, message, args, config, blacklist, wtpokes) => {
    if (wtpAlreadyRunning.has(message.guild.id)) return message.channel.send("THERE IS A GAME RUNNING HERE. PLEASE FINISH THAT ONE FIRST.")

    if (args[0] == "top" || args[0] == "leaderboard") return leaderboardShower(client, message, args);

    if (args[1] && args[1].startsWith("-gen")) { // Generation Selector
        var generationChosen = args[1].substring(args[1].length - 1, args[1].length);   
        if (!parseInt(generationChosen)) return message.channel.send("YOU DIDN'T SPECIFIC A VALID GENERATION!");
        if (generationChosen > 7) return message.channel.send("THERE ISN'T A GENERATION HIGHER THAN 7 YET! LOOK I KNOW GEN 8 WAS ANNOUNCED, BUT I ONLY KNOW SOME OF THE POKÉMON AND NOT ALL, SO I'M NOT ADDING THEM YET.");
        var pokesAllowed = generationIDs[generationChosen]
    } else {
        var pokesAllowed = "1,809"
    }

    // Pokemon Selector and Scrambler, and then all the difficulties and stuff
    if (!args[0]) return message.channel.send("FOR NOW, I NEED A DIFFICULTY (easy, normal, advanced, hard, master, impossible). YOU CAN ALSO SHOW THE LEADERBOARD (top) AND START A MULTIPLAYER GAME (multi).");
    wtpAlreadyRunning.add(message.guild.id);
    if (args[0] === "e" || args[0] ===  "easy") {
        easyDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] === "n" || args[0] === "normal") {
        normalDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] === "a" || args[0] === "advanced") {
        advDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] === "h" || args[0] === "hard") {
        hardDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] === "m" || args[0] === "master") {
        masterDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] === "i" || args[0] === "impossible") {
        impDiff(pokesAllowed, wtpokes, message)
    } else if (args[0] == "tourney" || args[0] == "multi") {
        // wtpAlreadyRunning.add(message.guild.id);
        let wtpfile = require(`../misc/multiwtp.js`);
        wtpfile.run(client, message, args, wtpokes);
        wtpAlreadyRunning.delete(message.guild.id);
    } else {
        message.channel.send("I DON'T RECOGNISE THAT OPTION.")
        wtpAlreadyRunning.delete(message.guild.id);
    }

};  

exports.help = {
    name: "wtp",
    description: "Who's That Pokémon? Guess the Pokémon from a scrambled up combination of letters, and win points to defeat all of your friends in the leaderboard!",
    aliases: "whosthatpokemon, who'sthatpokemon",
    usage: "d!wtp <easy/normal/advanced/hard/master/impossible/multi/top>",
    cooldown: 3
}