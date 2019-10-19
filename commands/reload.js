exports.run = (client, message, args, config) => {
  if (message.author.id != config.adminID) return;
    if(!args || args.size < 1) return message.channel.send("WHERE'S THE COMMAND TO RELOAD?");
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.channel.send(`THE COMMAND ${args[0]} HAS BEEN UNLINKED, IT IS NOW READY TO BE RELOADED INTO MEMORY.`);
  };