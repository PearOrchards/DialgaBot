const download = require('download-file');
const fs = require("fs");

exports.run = (client, message, row) => {
    if (row.complete == "NO") return;
    if (message.channel.id == row.channelID) return;

    var sets = row.settings;
    var setsA = sets.split(",")

    if (setsA.includes("ig_bts")) {
        if (message.author.bot) return;
    }

    var files = []
    var urls = []
    var toDelete = []
    
    var Attachment = (message.attachments).array();
    var i = 0;
    Attachment.forEach(function(attachment) {
        i++
        var url = attachment.url;
        var filename = attachment.filename
        if (filename.endsWith('.png') || filename.endsWith('.jpeg') || filename.endsWith('.jpg') || filename.endsWith('.tiff') || filename.endsWith('.tif') || filename.endsWith('.gif') || filename.endsWith('.bmp')) {

            var filena = i + attachment.filename

            var options = {
                directory: "./logsDat/",
                filename: filena,
                time: 5000
            }
            
            download(url, options, function(err) {
                if (err) throw err
                files.push(`./logsDat/${filena}`);
                toDelete.push(`./logsDat/${filena}`);
            })
        } else {
            urls.push(url)
        }
    });

    client.setTimeout(() => {
        var logChannel = client.channels.get(row.channelID)
        var toSend = row.messageStructure;
        var theMsg = message.content.substr()

        if (setsA.includes("esc_tgs")) {
            if (message.mentions.members) {
                var theMsg = theMsg.replace(/<@/g, `<tags: `); // Now add a way to add esc_tgs
            };
        };

        var toSend1 = toSend.replace(/%user/g, message.author.username).replace(/%channel/g, message.channel.name).replace(/%msg/g, theMsg)

        if (files.length > 0) {
            if (urls.length > 0) {
                var toSend2 = toSend1.replace(/%urls/g, urls.join())
                logChannel.send(toSend2, {
                    files: [
                        files[0]
                    ]
                });
                if (files.length > 1) {
                    files.shift()
                    for(s = 0; s < files.length; s++) {
                        logChannel.send({
                            files: [
                                files[s]
                            ]
                        })
                    }
                }
            } else {
                var toSend2 = toSend1.replace(/%urls/g, "")
                logChannel.send(toSend2, {
                    files: [
                        files[0]
                    ]
                });
                if (files.length > 1) {
                    files.shift()
                    for(s = 0; s < files.length; s++) {
                        logChannel.send({
                            files: [
                                files[s]
                            ]
                        })
                    }
                }
            }
        } else {
            if (urls.length > 0) {
                var toSend2 = toSend1.replace(/%urls/g, urls.join())
                logChannel.send(toSend2);
            } else {
                var toSend2 = toSend1.replace(/%urls/g, "")
                logChannel.send(toSend2);
            }
        }

        setTimeout(() => {
            if(toDelete.length > 0) {
                toDelete.forEach(element => {
                    fs.unlinkSync(element)
                });
            }
        }, 2000)
    }, 5000);
}