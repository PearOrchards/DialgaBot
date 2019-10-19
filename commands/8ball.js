exports.run = (client, message, args) => { 
    roll = Math.floor(Math.random()*24) + 1;
    switch(roll) {
        case 1:
            message.channel.send("I ASSUME YES");
            break;
        case 2:
            message.channel.send("MAYBE?");
            break;
    
        case 3:
            message.channel.send("UHHHHH... YES?");
            break;
        case 4:
            message.channel.send("I'M DISAPPOINTED YOU ASKED ME THAT.");
            break;
        case 5:
            message.channel.send("NO. BUT I'M ONLY SAYING THAT BECAUSE I DON'T KNOW WHAT YOU ARE ON ABOUT.");
            break;
        case 6:
            message.channel.send("I CAN'T BELIEVE YOU JUST ASKED ME THAT. YES.");
            break;
        case 7:
            message.channel.send("YOU'RE WASTING MY MEMORY CAPACITY.");
            break;
        case 8:
            message.channel.send("CAN'T ANSWER NOW, DUSKNOIR IS BEING AN IDIOT AGAIN.");
            break;
        case 9:
            message.channel.send("EITHER I ANSWER AND DESTROY THE WORLD OR I DON'T ANSWER. I'LL LET YOU DECIDE.");
            break;
        case 10:
            message.channel.send("*DEEP SIGH*... NO.");
            break;
        case 11:
            message.channel.send("I DON'T THINK I WANT TO ANSWER THAT");
            break;
        case 12:
            message.channel.send("YES, NOW LEAVE ME ALONE!");
            break;
        case 13:
            message.channel.send("I'M NOT INTERESTED")   
            break;
        case 14:
            message.channel.send("DOES ANYONE HAVE ANY EARMUFFS?")
            break;
        case 15:
            message.channel.send("YEAH JUST DO IT.")
            break;
        case 16: 
            message.channel.send("BETTER NOT TO ASK NOW")
            break;
        case 17: 
            message.channel.send("A BIGGER CONCERN IS WHY YOU ASKED THAT")
            break;
        case 18: 
            message.channel.send("YES")
            break;
        case 19: 
            message.channel.send("NO")
            break;
        case 20: 
            message.channel.send("THINK ABOUT WHAT YOU'RE TYPING, THEN ASK AGAIN")
            break;
        case 21: 
            message.channel.send("ASK AGAIN LATER")
            break;
        case 22: 
            message.channel.send("I DOUBT IT")
            break;
        case 23: 
            message.channel.send("LOOKING AT THE FUTURE, OUTCOME IS GOOD")
            break;
        case 24: 
            message.channel.send("LOOKING AT THE FUTURE, OUTCOME IS BAD")
            break;
        }
    };

exports.help = {
    name: "8ball",
    description: "Ask a question, shake the 8-Ball, and... hope for a good answer.",
    aliases: "ask, advice, question",
    usage: "d!8ball <question>",
    cooldown: 4
}