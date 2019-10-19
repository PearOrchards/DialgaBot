randDiffMessage = {
    1: "1 FOR EASY",
    2: "2 FOR NORMAL",
    3: "3 FOR ADVANCED",
    4: "4 FOR HARD",
    5: "5 FOR MASTER"
}

randStrucMessage = {
    1: "1 FOR TALL",
    2: "2 FOR FLAT"
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

function getPlayers(client, message, args, wtpokes, initiator) {
    message.channel.send("```md\n> ALRIGHT, TAG EVERY PLAYER WHO IS GOING TO PARTICIPATE IN THE MULTIPLAYER GAME.\n```")
    var filterPlayers = m => m.content
    var passPlayers = []
    var playersCollector = message.channel.createMessageCollector(filterPlayers, { time: 120000 }) // 2mins
    playersCollector.on('collect', message => {
        if (message.author.bot) return;
        if (message.author.id != initiator) return;
        arrayOfPlayers = message.mentions.members.array()
        arrayOfPlayers.forEach(element => {
            passPlayers.push(element.user.id)
        });
        if (passPlayers.length > 1) {
            getDifficulty(client, message, args, wtpokes, initiator, passPlayers); playersCollector.stop();
        } else {
            message.channel.send("```css\nNOT ENOUGH PLAYERS TAGGED```")
            passPlayers.length = 0
        }
    })
    playersCollector.on('end', collected => {
        if (passPlayers.length == 0) message.channel.send("```css\nTHERE WAS NO RESPONSE, CLOSING DOWN THE MULTIPLAYER INTERFACE.```")
    })
}

function getDifficulty(client, message, args, wtpokes, initiator, passPlayers) {
    var randomInteger = Math.floor(Math.random() * 5) + 1
    message.channel.send(`\`\`\`md\nOKAY, SO WHAT'S GOING TO BE THE DIFFICULTY FOR ALL OF THE GAMES? THE OPTIONS ARE:\n---\n1. EASY\n2. NORMAL\n3. ADVANCED\n4. HARD\n5. MASTER\n\n> PUT THE NUMBER FOR THE DIFFICULTY YOU WANT. FOR EXAMPLE, PUT ${randDiffMessage[randomInteger]}\`\`\``)
    var diffChosen = ""
    var filterDiff = m => m.content
    var diffCollector = message.channel.createMessageCollector(filterDiff, { time: 10000}) // 10 seconds
    diffCollector.on('collect', message => {
        if (message.author.bot) return;
        if (message.author.id != initiator) return;
        switch(message.content) {
            case "1":
                diffChosen = "e"
                break;
            case "2":
                diffChosen = "n"
                break;
            case "3":
                diffChosen = "a"
                break;
            case "4":
                diffChosen = "h"
                break;
            case "5":
                diffChosen = "m"
                break;
            default:
                message.channel.send("```css\nNOT A VALID OPTION. ARE YOU PUTTING A NUMBER INBETWEEN 1 AND 5?```")
                break;
        }
        if (diffChosen != "") {
            if (passPlayers.length == 2 || passPlayers.length == 3) {
                finalInitialiser(client, message, args, wtpokes, initiator, passPlayers, diffChosen, "t"); diffCollector.stop();
            } else {
                structureInitialiser(client, message, args, wtpokes, initiator, passPlayers, diffChosen); diffCollector.stop();
            }
        }
    })
    diffCollector.on('end', collected => {
        if (diffChosen == "") message.channel.send("```css\nTHERE WAS NO RESPONSE, CLOSING DOWN THE MULTIPLAYER INTERFACE.```")
    })
}

function structureInitialiser(client, message, args, wtpokes, initiator, passPlayers, diffChosen) {
    var randomInteger = Math.floor(Math.random() * 2) + 1
    message.channel.send(`\`\`\`md\nWHAT STRUCTURE DO YOU WANT THE LAYOUT OF THE MULTIPLAYER IN?\n---\n1. TALL (2 OR 3 PEOPLE IN EACH MATCH)\n2. FLAT (4 OR 5 PEOPLE IN EACH MATCH)\n\n> PUT THE NUMBER FOR THE LAYOUT YOU WANT. FOR EXAMPLE, PUT ${randStrucMessage[randomInteger]}\`\`\``)
    var filterStructure = m => m.content
    var structureChosen = ""
    var structCollector = message.channel.createMessageCollector(filterStructure, { time: 10000})
    structCollector.on('collect', message => {
        if (message.author.bot) return;
        if (message.author.id != initiator) return;
        switch(message.content) {
            case "1":
                structureChosen = "t"
                break;
            
            case "2":
                structureChosen = "f"
                break;

            default:
            message.channel.send("```css\nNOT A VALID OPTION. ARE YOU PUTTING 1 OR 2?```")
                break;
        }
        if (structureChosen != "") {
            finalInitialiser(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen); structCollector.stop();
        }
    })
    structCollector.on('end', collected => {
        if (structureChosen == "") message.channel.send("```css\nTHERE WAS NO RESPONSE, CLOSING DOWN THE MULTIPLAYER INTERFACE.```")
    })
}

function finalInitialiser(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen) {
    // Groups Initialising
    var groups = []
    var players = passPlayers.length
    if (structureChosen == "t") {
        while (players != 0) {
            if ((players - 2) >= 0) {
                groups.push(2)
                var players = players - 2
            } else {
                var lastGroup = groups.pop()
                groups.push(lastGroup + 1)
                var players = 0
            }
        }
    } else if (structureChosen == "f") {
        while (players != 0) {
            if ((players - 4) >= 0) {
                groups.push(4)
                var players = players - 4
            } else {
                for (x = 0; x < players; x++) {
                    var position = 0 - x
                    var lastGroup = groups.splice(position, 1)
                    groups.push(parseInt(lastGroup) + 1)
                    var players = players - 1
                }
            }
        }
    } else {
        message.channel.send("```css\nTHERE WAS AN ISSUE WITH THE FINAL INITALISER. PLEASE MESSAGE REPORT THIS, AS WELL AS YOUR PREVIOUS MESSAGES. CODE: GROUP_COUNT_ALLOCATION_FAILED```")
    }

    // Assign members to the groups
    var currentPlayer = 0
    var messageGroups = []
    for (y in groups) {
        var currentGroup = groups[y]
        var playersToAdd = []
        var currentNumber = parseInt(currentGroup)
        var currentGroupMessage = []
        for (z = 0; z < currentNumber; z++) {
            playersToAdd.push(passPlayers[currentPlayer])
            currentGroupMessage.push(` Player ${parseInt(z) + 1}: <@${passPlayers[currentPlayer]}>`)
            currentPlayer++
        }
        messageGroups.push(
            `\nGroup ${parseInt(y) + 1}:` + currentGroupMessage
        )
        groups.splice(y, 1, playersToAdd.join())
    } 

    if (passPlayers.length <= 3) {
        var winners = []; var n = 0;
        gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n); 
    } else {
        // Confirm everything
        message.channel.send(`\`\`\`md\nTHE GROUPS HAVE BEEN MADE. THEY WILL GO AS FOLLOWS\n---\`\`\`${messageGroups}\n\`\`\`md\n> DO YOU AGREE TO THESE GROUPS (y/n)\`\`\``)
        var filterFinal = m => m.content
        var passFinal = []
        var finalCollector = message.channel.createMessageCollector(filterFinal, { time : 60000})
        finalCollector.on('collect', message => {
            if (message.author.bot) return;
            if (message.author.id != initiator) return;
            switch(message.content) {
                case "y":
                    message.channel.send("```css\nTHANKS FOR CONFIRMING, THE FIRST GAME WILL START SHORTLY```")
                    var winners = []; var n = 0;
                    gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n); finalCollector.stop(); passFinal.push("+");
                    break;
                case "n":
                    message.channel.send("```css\nAWW, THAT'S A SHAME... I'LL CANCEL THE GAMES...```")
                    finalCollector.stop(); passFinal.push("+");
                    break;
                default:
                    message.channel.send("```css\nEITHER y OR n PLEASE```")
                    break;
            }
        })
        finalCollector.on('end', collected => {
            if (structureChosen.length == 0) message.channel.send("```css\nTHERE WAS NO RESPONSE, CLOSING DOWN THE MULTIPLAYER INTERFACE.```")
        })
    }
}

function gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n) {
    var playing = groups[n].split(",")
    var listOfCurrentPlayers = []
    for (i in playing) {
        listOfCurrentPlayers.push(`\n<@${playing[i]}>\nVS`)
    }
    message.channel.send(`\`\`\`md\nMATCH STARTED!\n---\`\`\`${listOfCurrentPlayers.join().slice(0, -3)}\n\`\`\`md\n> All players must type "y" or "yes" to continue. You have 120 seconds to start the match or all players in this match automatically lose.\`\`\``)
    var filterGame = m => m.content
    var confirmed = []
    var gameCollector = message.channel.createMessageCollector(filterGame, { time : 120000})
    gameCollector.on('collect', message => {
        if (message.author.bot) return;
        if (!playing.includes(message.author.id)) return;
        if ((message.content).toLowerCase() == "y" || (message.content).toLowerCase() == "yes") {
            if (!confirmed.includes(message.author.id)) {
                confirmed.push(message.author.id); message.channel.send("OKAY, YOU'RE NOW CONFIRMED TO BE READY.");
                if (confirmed.length >= playing.length) {
                    gameCollector.stop(); 
                }
            } else message.channel.send("YOU'VE ALREADY CONFIRMED THAT YOU'RE READY.");
        }
    })
    gameCollector.on('end', collected => {
        if (confirmed.length >= playing.length) {
            switch(diffChosen) {
                case "e":
                    var allPokes = [];
                    var allPokesShuffled = [];
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.forEach(element => {
                        allPokesShuffled.push(element.shuffle());
                    });
                    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "`. YOU HAVE 30 SECONDS TO GUESS THE RIGHT POKÉMON.");
    
                    var wtpCompletedE = [];
                    var filterwtp = m => m.content;
                    var wtpListenerE = message.channel.createMessageCollector(filterwtp, { time: 30000 });
                    wtpListenerE.on('collect', message => {
                        if (message.author.bot) return;
                        if (!playing.includes(message.author.id)) return;
                        if (message.content.toLowerCase() === allPokes[0].toLowerCase()) {
                            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`. YOU'RE GOING THROUGH TO THE NEXT ROUND!\n```md\n---```");
                            wtpCompletedE.push("+"); wtpListenerE.stop(); winners.push(message.author.id); n++;
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    wtpListenerE.on('end', collected => {
                        if (wtpCompletedE.length == 0) {
                            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS ``" + allPokes[0] + "``.\n```md\n---```"); // Copy the \n`````` bit into the other times this happens.
                            n++
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    break;
                
                case "n":
                    var allPokes = [];
                    var allPokesShuffled = [];
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.forEach(element => {
                        allPokesShuffled.push(element.shuffle().toLowerCase());
                    });
                    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "`. YOU HAVE 15 SECONDS TO GUESS THE RIGHT POKÉMON.");

                    var wtpCompletedN = [];
                    var filterwtp = m => m.content;
                    var wtpListenerN = message.channel.createMessageCollector(filterwtp, { time: 15000 });
                    wtpListenerN.on('collect', message => {
                        if (message.author.bot) return;
                        if (message.content.toLowerCase() === allPokes[0].toLowerCase()) {
                            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`.```md\n---```");
                            wtpCompletedN.push("+"); wtpListenerN.stop(); winners.push(message.author.id); n++;
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    wtpListenerN.on('end', collected => {
                        if (wtpCompletedN.length == 0) {
                            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS ``" + allPokes[0] + "``.```md\n---```");
                            n++
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    break;
    
                case "a":
                    var allPokes = [];
                    var allPokesShuffled = [];
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.forEach(element => {
                        allPokesShuffled.push(element.shuffle());
                    });
                    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "` AND `" + allPokesShuffled[1] + "`. YOU HAVE 20 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2>, <POKÉMON 1/2>`)");
                
                    var allPokesLower = allPokes.map(v => v.toLowerCase());

                    var wtpCompletedA = [];
                    var filterwtp = m => m.content;
                    var wtpListenerA = message.channel.createMessageCollector(filterwtp, { time: 20000 });
                    wtpListenerA.on('collect', message => {
                        if (message.author.bot) return;
                        answerA = message.content.trim().split(",")
                        if (answerA.length != 2) return message.channel.send("DID YOU PUT TWO POKÉMON SPLIT BY A COMMA THERE?");
                        if (allPokesLower.includes(answerA[0].toLowerCase()) && allPokesLower.includes(answerA[1].trim().toLowerCase())) {
                            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.```md\n---```");
                            wtpCompletedA.push("+"); wtpListenerA.stop(); winners.push(message.author.id); n++;
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        }
                    
                    });
                    wtpListenerA.on('end', collected => {
                        if (wtpCompletedA.length == 0) {
                            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.```md\n---```");
                            n++
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    break;
                
                case "h":
                    var allPokes = [];
                    var allPokesShuffled = [];
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.push(pokemonSelector("1,809", wtpokes));
                    allPokes.forEach(element => {
                        allPokesShuffled.push(element.shuffle().toLowerCase());
                    });
                    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "` AND `" + allPokesShuffled[1] + "`. YOU HAVE 10 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2>, <POKÉMON 1/2>`)");
                
                    var allPokesLower = allPokes.map(v => v.toLowerCase());

                    var wtpCompletedH = [];
                    var filterwtp = m => m.content;
                    var wtpListenerH = message.channel.createMessageCollector(filterwtp, { time: 10000 });
                    wtpListenerH.on('collect', message => {
                        if (message.author.bot) return;
                        answerH = message.content.trim().split(",")
                        if (answerH.length != 2) return message.channel.send("DID YOU PUT TWO POKÉMON SPLIT BY A COMMA THERE?");
                        if (allPokesLower.includes(answerH[0].toLowerCase()) && allPokesLower.includes(answerH[1].trim().toLowerCase())) {
                            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.```md\n---```");
                            wtpCompletedH.push("+"); wtpListenerH.stop(); winners.push(message.author.id); n++;
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        }
                    
                    });
                    wtpListenerH.on('end', collected => {
                        if (wtpCompletedH.length == 0) {
                            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "` AND `" + allPokes[1] + "`.```md\n---```");
                            n++
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    break;
                
                case "m":
                    var allPokes = [];
                    var allPokesShuffled = [];
                    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
                    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
                    allPokes.push(pokemonSelector(pokesAllowed, wtpokes));
                    allPokes.forEach(element => {
                        allPokesShuffled.push(element.shuffle().toLowerCase());
                    });
                    message.channel.send("THE POKÉMON IS `" + allPokesShuffled[0] + "`, `" + allPokesShuffled[1] + "` AND `" + allPokesShuffled[2] + "`. YOU HAVE 15 SECONDS TO GUESS THE RIGHT POKÉMON. (LAY YOUR ANSWER OUT LIKE: `<POKÉMON 1/2/3>, <POKÉMON 1/2/3>, <POKÉMON 1/2/3>`)");
                
                    var allPokesLower = allPokes.map(v => v.toLowerCase());

                    var wtpCompletedM = [];
                    var filterwtp = m => m.content;
                    var wtpListenerM = message.channel.createMessageCollector(filterwtp, { time: 15000 });
                    wtpListenerM.on('collect', message => {
                        if (message.author.bot) return;
                        answerM = message.content.trim().split(",")
                        if (answerM.length != 3) return message.channel.send("DID YOU PUT THREE POKÉMON SPLIT BY A COMMA THERE?");
                        if (allPokesLower.includes(answerM[0].toLowerCase()) && allPokesLower.includes(answerM[1].trim().toLowerCase()) && allPokesLower.includes(answerM[2].trim().toLowerCase())) {
                            message.channel.send("`" + message.author.username + "` HAS GOT THE ANSWER! THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.```md\n---```");
                            wtpCompletedM.push("+"); wtpListenerM.stop(); winners.push(message.author.id); n++;
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        }
                    
                    });
                    wtpListenerM.on('end', collected => {
                        if (wtpCompletedM.length == 0) {
                            message.channel.send("UNFORTUNATELY, NO ONE HAS GOT THE ANSWER. THE ANSWER WAS `" + allPokes[0] + "`, `" + allPokes[1] + "` AND `" + allPokes[2] + "`.```md\n---```");
                            n++
                            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
                            else {
                                var passPlayers = winners
                                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
                            }
                        };
                    });
                    break;
    
                default:
                    message.channel.send("```THERE WAS AN ISSUE WITH THE GAME HANDLER. PLEASE MESSAGE REPORT THIS, AS WELL AS YOUR PREVIOUS MESSAGES. CODE: FINDING_DIFF_FUNCTION_FAILED```")
                    break;
            }
        } else {
            message.channel.send("SINCE NOT EVERYONE CONFIRMED, THE ROUND DIDN'T HAPPEN, AND NO ONE HAS GONE THROUGH. MOVING ON..."); n++;
            if ((n + 1) <= groups.length) gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n)
            else {
                var passPlayers = winners
                bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen)
            }
        }
    })
}

function bridger(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen) {
    if (passPlayers.length == 1) {
        message.channel.send(`CONGRATULATIONS <@${passPlayers[0]}>! YOU HAVE WON THE GAME!`)
    } else if (passPlayers.length == 0) {
        message.channel.send(`...NO ONE WON. HUH. THAT WAS SLIGHTLY DISAPPOINTING.`)
    } else {
        var groups = []
        var players = passPlayers.length
        if (structureChosen == "t") {
            while (players != 0) {
                if ((players - 2) >= 0) {
                    groups.push(2)
                    var players = players - 2
                } else {
                    var lastGroup = groups.pop()
                    groups.push(lastGroup + 1)
                    var players = 0
                }
            }
        } else if (structureChosen == "f") {
            while (players != 0) {
                if ((players - 4) >= 0) {
                    groups.push(4)
                    var players = players - 4
                } else {
                    for (x = 0; x < players; x++) {
                        var position = 0 - x
                        var lastGroup = groups.splice(position, 1)
                        groups.push(parseInt(lastGroup) + 1)
                        var players = players - 1
                    }
                }
            }
        } else {
            message.channel.send("```THERE WAS AN ISSUE WITH THE BRIGDE INITALISER. PLEASE MESSAGE REPORT THIS, AS WELL AS YOUR PREVIOUS MESSAGES. CODE: GROUP_COUNT_ALLOCATION_FAILED```")
        }
    
        var currentPlayer = 0
        for (y in groups) {
            var currentGroup = groups[y]
            var playersToAdd = []
            var currentNumber = parseInt(currentGroup)
            for (z = 0; z < currentNumber; z++) {
                playersToAdd.push(passPlayers[currentPlayer])
                currentPlayer++
            }
            groups.splice(y, 1, playersToAdd.join())
        }
    
        message.channel.send("```NEXT SET OF GAMES STARTING!```")
        var n = 0; var winners = []
        gameHandler(client, message, args, wtpokes, initiator, passPlayers, diffChosen, structureChosen, groups, winners, n);
    }
}

exports.run = (client, message, args, wtpokes) => {
    var initiator = message.author.id
    message.channel.send("```md\nWELCOME TO THE MULTIPLAYER INTERFACE.\n===================================\nHERE, I'LL NEED THE FOLLOWING PARAMETERS.\n---\n1. All of the players that are participating tagged\n2. Difficulty for all games\n3. Teaming Structure (tall/flat)\n\n> TYPE 'next' WHEN YOU'VE GOT ALL OF THESE ON HAND AND READY TO PROCEED```")
    var filterInital = m => m.content
    var passInital = []
    var initalCollector = message.channel.createMessageCollector(filterInital, { time: 30000 })
    initalCollector.on('collect', message => {
        if (message.author.bot) return;
        if (message.author.id != initiator) return;
        if (message.content.toLowerCase() == "next") {
            passInital.push("+"); initalCollector.stop(); getPlayers(client, message, args, wtpokes, initiator)
        }
    })
    initalCollector.on('end', collected => {
        if (passInital.length == 0) message.channel.send("```THERE WAS NO RESPONSE, CLOSING DOWN THE MULTIPLAYER INTERFACE.```")
    })
}