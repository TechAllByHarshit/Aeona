let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'pokemon',
    type: 'info',
    usage: '&{prefix}pokemon <name>',
    description: 'get details of a pokemon.',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    aliases: [],
    async execute(message, args, bot, Discord, prefix) {
        
        const poke = args[0];
        if (poke===undefined) {
            message.channel.send(`${prefix}pokemon <name>`); 
            return;
        }
        message.channel.sendTyping();
        const fetch = require("node-fetch");
        try {
            fetch(`https://some-random-api.ml/pokedex?pokemon=${poke}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                if (data.name===undefined){
                    message.reply("Could not find that pokemon. 💔");
                    return;
                }
                let stats = "";
                for (let [key, value] of Object.entries(data.stats)) {
                  stats += `${key}: ${value}\n`;
                }
                const pokemon = embedbuilder.createEmbedGenerator(message)
                    .setTitle(data.name.toUpperCase())
                    .addFields(
                        { name: "Name", value: data.name},
                        { name: "Type" , value: data.type.map(el=>el).join(", ")},
                        { name: "Abilities", value: data.abilities.map(el=>el).join(", ")},
                        { name: "Height", value: `${data.height}`},
                        { name: "Weight", value: data.weight},
                        { name: "Evolution", value: data.family.evolutionLine.length>0?data.family.evolutionLine.map(el=>el).join("→"):"no evolution"},
                        { name: "Stats", value: stats}
                    )
                    .setThumbnail(`http://i.some-random-api.ml/pokemon/${poke}.png`);
                message.channel.send({embeds:[pokemon]});
            })
        }
        catch (err){
                message.channel.send("💔 Something went wrong");
        }
    }
}
