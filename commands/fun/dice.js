let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'roll',
    type: 'fun',
    usage: `&{prefix}dice `,
    description: 'gives a random number between 1 and 6 (or 1 and the number provided)',
    aliases: ["dice"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let upperlimit = 6;
        if (args[0]&&isNaN(args[0])) return message.reply("Invalid argument");
        if (args[0]&&(args[0]>1024||args[0]<2)) return message.channel.send("Argument provided should be between 2 and 1024");
        if (args[0]) upperlimit = args[0];
        let emb =embedbuilder.createEmbedGenerator(message)
         .setTitle("Number roll")
         .setDescription(`The number rolled is ${Math.floor(1+Math.random()*upperlimit)}`)
         message.channel.send({embeds: [emb.embed]});
    }
}
