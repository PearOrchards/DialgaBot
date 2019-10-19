exports.run = (client, message, args, config) => {
        if (message.author.id !== config.adminID) return;
        else {
            client.destroy();
            process.exit();
        }
    }