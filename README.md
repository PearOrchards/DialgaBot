# DialgaBot

**The Pokémon Mystery Dungeon based Discord Bot that yells nonstop, and is now completely open source!**

Current Features: 
 - Who's That Pokémon
 - Random Fun Commands
 - Many Say Commands
 - Global and Local Levels and Leaderboards
 
 If you're not interested in hosting yourself, feel free to just use the existing bot, and invite using [this link](http://bit.ly/InviteDialgaBot)

 _Interested in just playing Who's That Pokémon? There's now a website for that! [Visit Who's That Pokémon today!](https://wtp.orchards.dev/ "WTP @ orchards.dev")_

## Installation
DialgaBot wasn't created in portability in mind, but if you have a basic understanding on how Node.JS works, then you should be fine in installing this.

 1. Download this repository and place it somewhere you can remember.
 2. Create a bot account in your Discord Developer account, and add that bot account into your server. Simply:  
    *a. Go to the [Developers Page](https://discordapp.com/developers/applications/) (this will require you to log in to your Discord account)*  
    *b. Click the `New Application` button and enter a name (eg, "DialgaBot")*  
    *c. Go to the `Bot` section, and create the bot account*  
    *d. Copy the Client ID (in General Information)*  
    *e. Use [this site](https://discordapi.com/permissions.html) to create an invite link, and use it.*
	 
 3. Install Node.JS on your computer, which you can get from [here](https://nodejs.org/en/download/).  
    	DialgaBot is hosted on v10.15.2, so **I would strongly recommend using the latest version of Node.JS v10 at the latest**. 
 4. With a Powershell with Administrator perms open, and in DialgaBot's folder, do the command `npm i` 
 5. Go into config.json, and put your bot's token into the "" next to token:
 6. Do the command `node main.js` and everything should be working!

### A warning about the packages
Truthfully, it's a miracle that I can keep this bot running as well as it currently is, as not-even-recent changes in Discord's API have caused huge breaking changes in older versions of Discord.JS, to the point where fixing them would likely require a total rewrite of the code, which unfortunately is not something I'm motivated to do.  
On top of this, almost every other package that DialgaBot requires is completely out of date.  
But there's "a" workaround to allow DialgaBot to work. All you have to do is modify the Discord.JS package directly, and **comment out lines related to stage channels**. Follow the errors to find the relevant lines; I can't tell you which because they keep changing.

... Good luck!

## Support
Please open an issue here on the repo, or if it's easier, you can join DialgaBot's Discord Server, which you can find [here](https://discord.gg/WK73HGC).

## Contributing and Licensing
DialgaBot uses GNU GPL v2.0 as its license. If you want to create your own things using this bot, follow that license and its terms.

If you would like to contribute, feel free to do so!
The master branch will be protected for obvious reasons, but feel free to fork into your own area, push to a new branch in that, and then create a pull request. I would greatly appreciate help in this project!
Also, just give enough detail if you're creating an issue. It'll just make things faster for everyone :P

*©2016 Pokémon. ©1995–2016 Nintendo / Creatures Inc. / GAME FREAK inc. © 2016 Pokémon/Nintendo Pokémon and Pokémon character names are trademarks of Nintendo. Potential copyright infringement is not intended.*
