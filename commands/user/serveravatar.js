let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'server-avatar',
    type: 'fun',
    usage: `&{prefix}server-avatar <user's mention (optional)>`,
    description: 'shows the user\'s avatar',
    aliases: ["sa", "serveravatar", "guildavatar"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        //return message.channel.send("in development")
        await message.guild.members.fetch();
        const mentionUser = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false|| message.guild.members.cache.get(args[0])|| args.length > 0 ? message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase())):false||message.member;
        const fetch = require("node-fetch");
        let res = await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${mentionUser.user.id}`, {
           headers: {
              Authorization: `Bot ${bot.token}`
           }
        }).then((res)=>{                 return res.json()})
        if (!res.avatar) {
           const emb = embedbuilder.createEmbedGenerator(message)
           .setTitle("No Server Avatar")
           .setDescription(`The above mentioned user, ${mentionUser}, does not have a server avatar.`)
           return message.channel.send({embeds: [emb.embed]});
        }
        const avataremb = new Discord.MessageEmbed()
        .setImage(`https://cdn.discordapp.com/guilds/${message.guild.id}/users/${mentionUser.user.id}/avatars/${res.avatar}.webp?size=4096`)
        .setTitle(`${mentionUser.user.tag}'s Server Avatar`)
        message.channel.send({embeds:[avataremb.embed]});
    }
}
