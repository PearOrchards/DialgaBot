exports.run = async (client, message, args) => {
    let pingAPI = (client.ping).toString().substr(0, 3);
    let timeNow = Date.now();;
    let msgData = await message.channel.send("Testing!").then(msg => {
        return getMsgData(msg);
    });
    let pingDelay = parseInt(msgData[1]) - timeNow;
    message.channel.send("PING! \:ping_pong: \nAPI: " + pingAPI + " ms\nMessage Delay: " + pingDelay.toString() + " ms");
    message.channel.fetchMessage(msgData[0]).then(msg => msg.delete());
};

function getMsgData(msg) {
    return [msg.id, msg.createdTimestamp];
};

exports.help = {
    name: "ping",
    description: "Ah yes, the obligatory ping command. Shows you DialgaBot's current ping, the delay between it's message and the time reading it, and if it's actually alive or not.",
    aliases: "pong",
    usage: "d!ping",
    cooldown: 2
};