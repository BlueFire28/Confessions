// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();

// Listener Event: Bot Launched
bot.on('ready', () => {
	console.log('Power Level Stabilised') // Runs when the bot is launched
	bot.user.setActivity("Send me a PM!")

});

// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
	if(message.channel.type == 'dm'){
		let channel = bot.channels.get("538886138866434069")
		return await channel.send(`Anonymous: ${message.content}`)
	}
}); //the end of bot.on ------------------------------


//  Login

// the bot.token('token')
bot.login(process.env.token);
