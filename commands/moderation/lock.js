let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'lock',
    type: 'moderation',
    usage: '&{prefix}lock <channel>',
    description: 'locks that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'MANAGE_GUILD'],
    async execute(message, args, bot, Discord, prefix) {
	channel = message.channel;
	if (args[0]&&message.mentions.channels.first()&&args[0].includes(message.mentions.channels.first().id))
	{
	    channel = message.mentions.channels.first();
	    args = args.slice(1);
	}

      if (channel.type=="GUILD_PUBLIC_THREAD"||message.channel.type=="GUILD_PRIVATE_THREAD") return message.reply("Cannot lock a thread.")
        if(!channel.permissionsFor(message.member).has("MANAGE_CHANNEL")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
	if (!channel.permissionsFor(channel.guild.roles.everyone).has("SEND_MESSAGES")) return message.channel.send(`${channel} is already locked`);
	channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SEND_MESSAGES: false });
	message.channel.send(`Successfully locked ${channel}`);
	let emb =  embedbuilder.createEmbedGenerator(message)
	    .setTitle("Channel locked")
	    .setDescription(`Locked this channel${args.length>0?"\nReason: "+args.join(" "):""}`)
	channel.send({embeds:[emb.embed]});
    }
}

