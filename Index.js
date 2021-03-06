console.log(process.version)
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const keepAlive = require('./server.js');
require('dotenv').config()

const bot = new Discord.Client({ intents: new Discord.Intents([
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"
]), allowedMentions: { parse: ['users', 'roles'], repliedUser: true }, partials: ["CHANNEL"] });

const mongo = require(`./mongo`);
require("./util/dbload")(bot);

const { Collection } = require('mongoose');
const fs = require('fs');
bot.slashCommands = [];
bot.commands = new Discord.Collection();
bot.allowedCommands = ["help"]
fs.readdir("./commands/", (err, categories)=>{
  if (err) return console.log(err)
  console.log(`Found total ${categories.length} categories`) 
  categories.forEach((category) =>{
    let cmd = fs.readdirSync(`./commands/${category}/`).filter(f=>f.endsWith(".js"))
    for (let command of cmd) {
      command = require(`./commands/${category}/${command}`)
      bot.commands.set(command.name, {category, command, aliases: command.aliases})
      if (command.slash){
        bot.slashCommands.push(command.slash.toJSON());
      }
    }
    console.log(`Loaded total ${cmd.length} commands in ${category}`);
  })
})

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}


bot.snipes = new Map();
bot.editSnipes = new Map();
bot.fasttype = new Array();
bot.aki = new Array();
bot.allowedBots = ["870239976690970625"];
bot.autoroleMissingPermissions = [];

setTimeout(()=>{
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
  rest.put(Routes.applicationCommands(bot.user.id), { body: bot.slashCommands })
	  .then(() => console.log('Successfully registered application commands.'))
	  .catch((error)=>console.log(error));

},10000)
process.on('uncaughtException', error => {
  console.log("Client caught an error and is restarting! \n Error: \n"+error +" \n Stack: "+error.stack);
  bot.login(process.env.TOKEN); 
})


keepAlive();
console.log("logged in");
bot.login(process.env.TOKEN); 



