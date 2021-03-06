let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'country',
    type: 'info',
    usage: '&{prefix}country <country code>',
    description: 'tells some details of a country.',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
       const code = args[0];
        if (code===undefined) {
            message.channel.send("%country <country alpha code>"); 
            return;
        }
        const fetch = require("node-fetch");
        try {
            fetch(`https://restcountries.eu/rest/v2/alpha/${code}`).then((res)=>{
                return res.json()
            }).then ((data)=>{
                if (data.name===undefined){
                    message.reply("Please enter a valid country code");
                    return;
                }
                const country = embedbuilder.createEmbedGenerator(message)
                    .setTitle(data.name)
                    .addFields(
                        { name: "Native Name", value: `${data.nativeName}`, inline: true},
                        { name: "Capital" , value: `${data.capital}`, inline: true},
                        { name: "Population", value: `${data.population}`, inline: true},
                        { name: "Main Currency", value: `${data.currencies[0].name} (${data.currencies[0].symbol})`, inline: true},
                        { name: "Region", value: `${data.region}`, inline: true},
                        { name: "Demonym", value: `${data.demonym}`, inline: true},
                        { name: "Area", value: `${data.area} km`, inline: true}
                    )
                    .setFooter("via restcountries.eu")
                    .setThumbnail(`https://www.countryflags.io/${data.alpha2Code}/flat/64.png`);
                message.channel.send({embeds:[country.embed]});
            })
        }
        catch (err){
                message.channel.send(":broken-heart: Something went wrong");
        }
    }
}
