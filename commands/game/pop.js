let embedbuilder=require("../../util/embedBuilder.js")
module.exports = {
    name: 'pop',
    type: 'game',
    usage: `&{prefix}pop`,
    aliases: [],
    description: 'Starts a pop game. The first one to find and send the hidden word wins!',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        
        let str = "";
            let row = 7, col = 7;
            let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let word = ""
            for (let k = 1; k<=3; k++) {
                word += chars[Math.floor(Math.random()*chars.length)]
            }
            let rp = Math.floor((Math.random() * row) + 1), cp = Math.floor((Math.random() * col) + 1);
            for (let i = 1; i<=row; i++) {
                for (let j = 1; j<=col; j++) {
                    if (i == rp && j == cp)
                        str += `||**\`${word}\`**|| `
                    else
                        str+="||`pop`|| "
                }
                str+="\n";
            }
            let newStr = str.replace(/\|\|/g, "")
            let game = embedbuilder.createEmbedGenerator(message)
            .setTitle("Pop game started")
            .setDescription(str)
            filter = (m)=>{return m.content == word}
            let msg = await message.channel.send({content:"**Find the hidden word. The first one to send it in the chat wins! (Case-Sensitive)**",embeds:[game]})
                message.channel.awaitMessages({filter,max: 1, time: 45000, errors: ["time"]})
                .then((collected)=>{
                    let winner = collected.first()
                    let game = embedbuilder.createEmbedGenerator(message)
                    .setTitle(`${winner.author.username} has won!`)
                    .setDescription(newStr)
                     msg.edit({content:`**<@${winner.author.id}> has won!**`, embeds:[game]});
                })
                .catch((err)=>{
                    let game = new Discord.MessageEmbed()
                    .setTitle("Looks like nobody won")
                    .setDescription(newStr)
                    msg.edit({content:"**Either nobody messaged or nobody got the correct answer.**",embeds:[game]})
                })
        
    }
}
