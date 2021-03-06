let embedbuilder = require("../../util/embedBuilder.js")
module.exports = {
    name: 'editsnipe',
    type: 'utility',
    usage: '&{prefix}editsnipe',
    description: 'shows last edited message in that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
      const channel = message.mentions.channels.first() || message.channel;

      let msg = bot.editSnipes.get(channel.id);
      if (!msg) return message.channel.send("There is no edited message in this channel.");

      let editSnipeEmbed = embedbuilder.createEmbedGenerator(message)
      .addFields(
        {name: "Old Message", value: msg.oldContent != ""?msg.oldContent:"[NA]"},
        {name: "New Message", value: msg.newContent != ""?msg.newContent:"[NA]"}
      )
      .setAuthor(msg.author, msg.avatar)
      .setDescription(`Message Edited on: <t:${Math.floor(msg.time/1000)}:f>`)
      
      message.channel.send({ embeds: [editSnipeEmbed.embed] });
    }
}
