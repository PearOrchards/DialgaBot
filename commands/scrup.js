const sql = require("sqlite");
sql.open("./score.sqlite");

exports.run = (client, message, args, config, blacklist) => {
    if (message.author.id != 137652130084290560) return;

    var guildsToUpdate = client.guilds.map(g => g.id)
    .forEach(value => {
        sql.run("SELECT * FROM sqlite_master WHERE type = 'table' AND name = ?", [value + "_score"]).then(table => {
            sql.each(`SELECT * FROM "${value + "_score"}"`, (err, row) => {
                let curLevel = Math.floor(0.2 * Math.sqrt(row.points * 2));
                if (curLevel > row.level) {
                    sql.run("UPDATE '" + value + "_score' SET level = " + (Math.floor(curLevel) - 1) + " WHERE userId = " + row.userId);
                }
            }).catch(err => {
                console.error;
            })
        }).catch(err => {
            console.error;
        })
    });
    message.channel.send("UPDATING, CHECK THE CONSOLE FOR ANY ERRORS.")
}