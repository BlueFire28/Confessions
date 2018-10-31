// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("opusscript");
const YouTube = require("simple-youtube-api")
const prefix = '`' // The text before commands

// Okay, i wont worry about it ;)
var coinflip = false;
const workCooldown = new Set();
const mutedSet = new Set();
const queue = new Map();
const youtube = new YouTube(process.env.ytapi)
var stopping = false;
var voteSkipPass = 0;
var voted = 0;
var commands1 = {
	purge: {
		usage: prefix + "purge (num)",
		description: `Delete some messages.`
	},
	leaderboard: {
		usage: prefix + "leaderboard",
		description: `Get the leaderboard of the top players`
	},
	"8ball": {
		usage: prefix + "8ball (yes/no question)",
		description: `Get that answer to the long awaited yes or no question.`
	},
	botinfo: {
		usage: prefix + "botinfo",
		description: `Get info about the bot.`
	},
	serverinfo: {
		usage: prefix + "serverinfo",
		description: `Get info about the server.`
	},
	roleinfo: {
		usage: prefix + "roleinfo (@role)",
		description: `Get info on a role.`
	},
	member: {
		usage: prefix + "member (@member)",
		description: `Get info on a member`
	},
	play: {
		usage: prefix + "play (url/search term/playlist)",
		description: `Play a song in a voice channel.`
	},
	queue: {
		usage: prefix + "queue",
		description: `Get the queue of the server.`
	},
	skip: {
		usage: prefix + "skip",
		description: `Skip the current song, this is a vote.`
	},
	mstop: {
		usage: prefix + "mstop",
		description: `Stop the music playing.`
	},
	np: {
		usage: prefix + "np",
		description: `See what song is currently playing.`
	},
	volume: {
		usage: prefix + "volume",
		description: `See what the volume of the bot is currently set to, add a number to set it.`
	},
	report: {
		usage: prefix + "report (@user) (reason)",
		description: `Report a user.`
	},
	bal: {
		usage: prefix + "bal",
		description: `Check your balance.`
	},
	coinflip: {
		usage: prefix + "coinflip",
		description: `Flip a coin then guess what it landed on.`
	},
	diceroll: {
		usage: prefix + "diceroll (num)",
		description: `Roll a die and guess what it landed on, you have a range of 1`
	},
	"8ball": {
		usage: prefix + "8ball (yes/no question)",
		description: `Get that answer to the long awaited yes or no question.`
	},
	work: {
		usage: prefix + "work",
		description: `Work for some money`
	},
	addmoney: {
		usage: prefix + "addmoney (@user) (num)",
		description: `Add money to a user`
	},
	removemoney: {
		usage: prefix + "removemoney (@user) (num)",
		description: `Remove money from a user`
	}
};
var playerVoted = [];
const profanities = ["test", "test2"];

// json files
var userData = JSON.parse(fs.readFileSync("./storage/userData.json", "utf8"))

// Listener Event: Bot Launched
bot.on('ready', () => {
    console.log('Power Level Stabilised') // Runs when the bot is launched

    //const botchat = bot.channels.get("469992574791319552")
    //const generalchat = bot.channels.get("469490700845580298")
    //generalchat.send(`Topic of the week: `)
    
    
    bot.user.setActivity("prefix " + prefix + " | Blocks Awakens")

});

//event listener: join/leave a voice channel
bot.on('voiceStateUpdate', (oldMember, newMember) => {
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  let ivc = newMember.guild.roles.find("name", "In Voice Call");
  
  if(oldUserChannel === undefined && newUserChannel !== undefined) { // User Joins a voice channel
    newMember.addRole(ivc).catch(console.error);
  } else if(newUserChannel === undefined) { // User leaves a voice channel
    newMember.removeRole(ivc).catch(console.error);
  }
});


// event listener: new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'pending');
    const channelinfo = member.guild.channels.find('name', 'info');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(``);
    
  });

// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    let Owner = message.guild.roles.find('name', "Owner")    
    let Staff = message.guild.roles.find('name', "Staff")
    let PlayerRole = message.guild.roles.find('name', "Player")
    let muted = message.guild.roles.find('name', "Muted")
    
    //json stuff
    if (!userData[sender.id]) userData[sender.id] = {}
    if (!userData[sender.id].money) userData[sender.id].money = 0;
    if (!userData[sender.id].SP) userData[sender.id].SP = 0;
    if (!userData[sender.id].appsNumber) userData[sender.id].appsNumber = 0;
    if (!userData[sender.id].username) userData[sender.id].username = sender.username;
    if (!userData[sender.id].warns) userData[sender.id].warns = 0;

    fs.writeFile('./storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err)
    });
	/*
    //message filtering
    const viollogs = bot.channels.get("428270869144403968")

    for (x=0; x<profanities.length; x++) {
      if (msg.includes(profanities[x])) {
          if (bot.user.id === sender.id || "186487324517859328" === sender.id) { return }
         
          if (!violationsNumber[sender.id]) violationsNumber[sender.id] = {viol: 0};
                    let userData = violationsNumber[sender.id];
                    userData.viol++;

                    fs.writeFile("./storage/violations.json", JSON.stringify(violationsNumber), (err) => {
                      if (err) console.error(err)
                    });
                      let violationEmbed = {embed: {
                        color: 0xff0000,
                        title: "<:yikers:408342164922433556> **Profanity** Detected <:yikers:408342164922433556>",
                        description: '**Message sent by **' + sender + '** deleted in **<#' + message.channel.id + "> \n" + `"${msg}"` + "\n \n" + `current violations: **${userData.viol}**`,
                        timestamp: new Date(),
                        footer: {
                          icon_url: sender.avatarURL,
                          text: `Username: ${nick} | ID: ${sender.id}`
                        }
                      }}

              await message.delete()
              .then(viollogs.send(violationEmbed))
              .catch(console.error);

              let tomute =  message.guild.members.get(sender.id)
              let muterole = message.guild.roles.find(`name`, "muted" || `name`, "Muted");
              
              //start of create role
              if(!muterole){
                try{
                  muterole = await message.guild.createRole({
                    name: "muted",
                    color: "#505050",
                    permissions:[]
                  })
                  message.guild.channels.forEach(async (channel, id) => {
                    await channel.overwritePermissions(muterole, {
                      SEND_MESSAGES: false,
                      ADD_REACTIONS: false
                    })
                  })
                }catch(e){
                  console.log(e.stack);
                }
              }
              //end of create role
              
              await(tomute.addRole(muterole.id));
              setTimeout(function(){
               tomute.removeRole(muterole.id);
              },(userData.viol * 60000))

              await(message.reply("**You violated one of our rules and got one automatic violation strike.**")
              .then(msg => {
                msg.delete(25000)
              }))
              

              if(userData.viol === 1) {
                message.guild.members.get(sender.id)
              .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0xff0000,
                  title: "Informative DM" ,
                 description: `You have violated our rules.\n  **Last Violation:** "${msg}" 
                 \nThe more you violate our rules, the bigger the punishment will be.` ,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: "Warning!"
                  }
                }}).catch(error)
              })};

            if(userData.viol === 10) {
              message.guild.members.get(sender.id)
              .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0xff0000,
                  title: "<:stop:429234690893938698> Inappropriate Behaviour <:stop:429234690893938698>" ,
                 description: `You have violated our rules many times as of now. **violations: 10** \nIf you continue to act like that you will be kicked, and then permabanned. \n\nLast Violation: ${msg}`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: "Warning!"
                  }
                }})
              })
              let reason = "The Account Has 10 Violations";
              viollogs.send({embed: {
                color: 0xff0000,
                title: "**Automatic Warn Report**",
                description: `**${reason}**`,
                timestamp: new Date(),
                footer: {
                  icon_url: sender.avatarURL,
                  text: `Username: ${nick} | ID: ${sender.id}`
                }
              }})
            }
          
          if(userData.viol === 15) {
            let reason = "The Account Has 15 Violations";
            message.guild.members.get(sender.id)
            .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0xff0000,
                  title: "Kicked" ,
                 description: `You have violated our rules many times as of now. **violations: 15** \nYou got kicked. Next punshment will be a permaban \n\nLast Violation: ${msg}`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: "Warning!"
                  }
                }})
              })
            message.guild.members.get(sender.id)
            .kick(reason)
              .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
            viollogs.send({embed: {
              color: 0xff0000,
              title: "**Automatic Kick Report**",
              description: `**${reason}**`,
              timestamp: new Date(),
              footer: {
                icon_url: sender.avatarURL,
                text: `Username: ${nick} | ID: ${sender.id}`
              }
            }})
          }
          
          if(userData.viol === 20) {
            let reason = "The Account Has 20 Violations";
            message.guild.members.get(sender.id)
            .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0xff0000,
                  title: "Permanently Banned" ,
                 description: `You have violated our rules many times as of now. **violations: 20** \nYou are permabanned. \n\nLast Violation: ${msg}`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: "Banned"
                  }
                }})
              })
            message.guild.members.get(sender.id)
            .ban(reason)
              .catch(error => viollogs.send(`I couldn't ban ${sender} because of : ${error}`));
            viollogs.send({embed: {
              color: 0xff0000,
              title: "**Automatic Ban Report**",
              description: `**${reason}**`,
              timestamp: new Date(),
              footer: {
                icon_url: sender.avatarURL,
                text: `Username: ${nick} | ID: ${sender.id}`
              }
            }})}
            
          return;
      }};*/
	
    
    // commands
	
	
    // Help
	if(msg.split(' ')[0] === prefix + 'help'){
		console.log('HELP INITIATED!')
      	let args = msg.split(" ").slice(1);
		console.log(args[0])
	
		if(!args[0]){
			let embed = new Discord.RichEmbed()
			.setDescription("All available commands")
			.setColor(0x00fff3)
			for(var name in commands1){
				embed.addField("Command:", name)
			}
			await message.channel.send(embed)
			return await message.channel.send("For info on a specific command, do " + prefix + "help (command)")
		}
		for(var name in commands1){
			if(args[0] === name){
				var commandname = name;
				let embed = new Discord.RichEmbed()
				.setDescription(name)
				.setColor(0x00fff3)
				.addField("Usage:", commands1[commandname].usage)
				.addField("Description:", commands1[commandname].description)
				return await message.channel.send(embed)
			}
    	}
		if(args[0]) return message.channel.send("Hm, check your spelling and try again!");
    };
	
	
    // Ping / Pong command
    if (msg === prefix + 'ping') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        let m = await message.channel.send("Ping?");
        m.edit(`Pong. Latency: ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
      } else {return}
    };
    
    // Leaderboard
	if(msg === prefix + "leaderboard"){
		var arr = sortObject(userData)
		console.log(arr.map(user => `**-** ${user.value}`))
		let leaderboard = new Discord.RichEmbed()
		.setDescription("**___Leaderboard___**")
		.setColor(0x15f153)
		.addField("Leaderboard", arr.map(user => `${message.guild.member(user.key)} **-** $${user.value}`))

		return await message.channel.send(leaderboard)
	};

    // Delete msgs
    if (msg.split(" ")[0] === prefix + "purge"){
        if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
            let args = msg.split(" ").slice(1)
            let num = Number(args[0]);
            if (num > 100 || num < 2){
                return message.reply('Please enter a number between 2 and 100')
            }
            message.channel.bulkDelete(num).then(() => {
            message.channel.send("Deleted " + num + " messages.").then(msg => msg.delete(5300));
            });
        }else {return}
    };


    //Single Poll
    if (msg.startsWith("poll:")) {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) { 
            let m = await message.react("👍")
            let m2 = await message.react("👎")
            let m3 = await message.react("🤷")
        } else {return};
      };


    //4poll
    if (msg.startsWith("4poll:")) {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) { 
            let m = await message.react("🤔")
            let m2 = await message.react("👉")
            let m3 = await message.react("👌")
            let m4 = await message.react("🖕")
        } else {return};
    };


    //bot info command
    if (msg === prefix + "botinfo") {
        let bicon = bot.user.displayAvatarURL

        let botembed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor(0x15f153)
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created At", bot.user.createdAt)

        message.channel.send(botembed)
    };


    //serverinfo command
    if (msg === prefix + "serverinfo") {
      let sicon = message.guild.iconURL
        
        let serverembed = new Discord.RichEmbed()
        .setDescription("__**Server Information**__")
        .setColor(0x15f153)
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("Total Members", message.guild.memberCount)
        .addField("Emoji", message.guild.emojis + "*work in progress*")

        await message.channel.send(serverembed)

    };


    //member info
    if (msg.split(" ")[0] === prefix + "member") {
      //ex `member @Rinkky
      let args = msg.split(" ").slice(1)
      let rMember = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let micon = rMember.displayAvatarURL

        if(!rMember) 
          return message.reply("Who dat user? I dunno him.")

          let memberembed = new Discord.RichEmbed()
          .setDescription("__**Member Information**__")
          .setColor(0x15f153)
          .setThumbnail(micon)
          .addField("Name", rMember)
          .addField("ID", rMember.id)
          .addField("Joined at", rMember.joinedAt)
  
          await message.channel.send(memberembed)

    };


    //role info
    if (msg.split(" ")[0] === prefix + "roleinfo") {
          //ex `roleinfo @owner
          //let args = msg.split(" ").slice(1)
          let rRole = message.mentions.roles.first()
          if(!rRole) return message.reply("Who dat role? I cant find it.")
          var rmembers = message.guild.roles.get(rRole.id).members.map(m=>m.user.tag)
          var numMembers = rmembers.length
          if(numMembers == 0) {
           let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, "None");
          await message.channel.send(roleembed) 
          }
          let roleembed = new Discord.RichEmbed()
          .setDescription("__**Role Information**__")
          .setColor(0x15f153)
          .addField("Name", rRole)
          .addField("ID", rRole.id)
          .addField(`Members with this role (${numMembers}):`, rmembers.join('\n'));
          await message.channel.send(roleembed) 
    };

    //reports
    if (msg.split(" ")[0] === prefix + "report") {
      //ex `report @Rinkky racist
      let args = msg.split(" ").slice(1)
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]))
      let rreason = args.join(" ").slice(22)
      let reportschannel = message.guild.channels.find(`name`, "staff")

        message.delete()

        if(!rUser) return message.reply("Da user you searchin, is unavailable, please report later.")
        if(!rreason) return message.reply("Where da reason? i dont see any.")

        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Report-ing for duty!")
        .setColor(0xe0782b)
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Reported By", `${sender} with ID: ${sender.id}`)
        .addField("Reason", rreason)
        .addField("Channel", message.channel)
        .addField("Reported At", message.createdAt)
        

        reportschannel.send(reportEmbed)
        message.guild.members.get(sender.id)
        .createDM()
              .then(dm => {
                dm.send({embed: {
                  color: 0x15f153,
                  title: "User Reported" ,
                 description: `You successfully reported ${rUser}. \nReason:${rreason} \n\n Thank you for your help, we'll investigate.`,
                 timestamp: new Date(),
                  footer: {
                  icon_url: "186487324517859328".avatarURL,
                  text: `Any intentionally misleading reports \nwill not be tolorated`
                  }
                }})
              })
    };

    //GAMBLING STUFF

    // bal access
    if (msg === prefix + 'bal') {
        let m = await message.channel.send({embed: {
            color: 0x05ff00,
            title: "Your balance",
            description: `${userData[sender.id].money}<:BlockCoins:503678855068778496> \n${userData[sender.id].SP} Event Points`,
            timestamp: new Date(),
            footer: {
              icon_url: sender.avatarURL
            }
          }
        })
    };


    //coinguess game

    const coin =  Math.floor((Math.random() * 2) + 1);

    if (msg === prefix + 'coinflip') {
        let m = await message.channel.send("**Flips a coin:** \nCommands: ___guess D___ - ___guess N___")
	coinflip = true;
    };

          //Diamonds

        if (msg === prefix + 'guess d' || msg === prefix + 'g d'  ) {
	  if (!coinflip) return message.reply('You never flipped a coin! Do `coinflip')
          if (coin <= 1) {
            let m = await message.reply('The coin landed on Diamonds, You won!', {files: ["./storage/images/diamonds.png"]}) //128x128 images are ideal
            userData[sender.id].money = (userData[sender.id].money+300)
            let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
          } else if (coin >= 2) {
            let m = await message.reply("The coin landed on Nuggets, you lost.", { files: ["./storage/images/nuggets.png"]})
            userData[sender.id].money = (userData[sender.id].money-150)
            let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
          }
	  coinflip = false;
        };
        
          //Nuggets

        if (msg === prefix + 'guess n' || msg === prefix + 'g n' ) {
	  if (!coinflip) return message.reply('You never flipped a coin! Do `coinflip')
          if (coin <= 1) {
            let m = await message.reply('The coin landed on Nuggets, You won!', {files: ["./storage/images/nuggets.png"]})
            userData[sender.id].money = (userData[sender.id].money+300)
            let m1 = await message.channel.send(` You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
            } else if (coin >= 2) {
            let m = await message.reply("The coin landed on Diamonds, you lost. ", {files: ["./storage/images/diamonds.png"]})
            userData[sender.id].money = (userData[sender.id].money-150)
            let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
          }
	  coinflip = false;
        };
    

    // Dice roll guess
    const roll =  Math.floor((Math.random() * 6) + 1);
    if(msg.split(" ")[0] === prefix + "diceroll"){
        let args = msg.split(" ").slice(1)
        if(args >=1 && args <= 6){
            if(args == roll + 1 || args == roll - 1 || args == roll){
                let m = await message.reply("You guessed in a range of 1 and were correct!",
                userData[sender.id].money = (userData[sender.id].money+150))
                let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
            }else{
                let m = await message.reply("You guessed in a range of 1 and were incorrect!",
                userData[sender.id].money = (userData[sender.id].money-50))
                let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
            }
        }else{
            return message.reply('Please enter a number between 1 and 6')
        }
       };
    

    // Work
    if(msg === prefix + "work"){
        if (workCooldown.has(sender.id)) {
               return message.reply("You must wait 10 minutes before working again.");
        } else {
            let money = Math.floor((Math.random() * 801) + 200);
            let m = await message.reply("You worked so hard and received " + money,
            userData[sender.id].money = (userData[sender.id].money+money))
            let m1 = await message.channel.send(`You now have: ${userData[sender.id].money}<:BlockCoins:503678855068778496>`)
            workCooldown.add(sender.id);
            setTimeout(() => {
              workCooldown.delete(sender.id);
            }, 600000);
        }
    };


    // Add money
    if(msg.split(" ")[0] === prefix + "addmoney"){
        if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
            let args = msg.split(" ").slice(1)
            let rUser = message.mentions.users.first()
            if (!userData[rUser.id]) userData[sender.id] = {}
            if (!userData[rUser.id].money) userData[sender.id].money = 0;
            if (!userData[rUser.id].SP) userData[sender.id].SP = 0;
            if (!userData[rUser.id].appsNumber) userData[sender.id].appsNumber = 0;
            if (!userData[rUser.id].username) userData[sender.id].username = sender.username;
            if(!rUser){
               return message.reply('Who is this person?')
            }
            let userId = rUser.id
            let addedmoney = Number(args[1]);
            if(addedmoney > 1){
                let m = await message.reply("You added " + addedmoney + " to " + rUser,
                userData[userId].money = (userData[userId].money + addedmoney))
                let m1 = await message.channel.send(rUser + ` now has ${userData[userId].money}<:BlockCoins:503678855068778496>`)
            }else{
                return message.reply('Please enter a number greater than 1')
            }
        }else {return}
    };
    

    // Remove money
    if(msg.split(" ")[0] === prefix + "removemoney"){
        if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
            let args = msg.split(" ").slice(1)
            let rUser = message.mentions.users.first()
            if(!rUser){
               return message.reply('Who is this person?')
            }
            let userId = rUser.id
            let addedmoney = Number(args[1]);
            if(addedmoney > 1){
                let m = await message.reply("You removed " + addedmoney + " from " + rUser,
                userData[userId].money = (userData[userId].money - addedmoney))
                let m1 = await message.channel.send(rUser + ` now has ${userData[userId].money}<:BlockCoins:503678855068778496>`)
            }else{
                return message.reply('Please enter a number greater than 1')
            }
        }else {return}
    };

    
    //8ball

    if (msg === prefix + "8ball") {
        let m = await message.reply('give me a question >:(')
    } else if (msg.startsWith(prefix + "8ball")) {
        var sayings = ["Of course not.",
                      "I believe it is true.",
                      "Can you repeat the question? i wasnt listening",
                      "Dont ask stupid things",
                      "Out of all the things you could ask.."];

        var results =  Math.floor((Math.random() * sayings.length) + 0)
        let m = await message.reply(sayings[results]);
    } else if (msg.startsWith(prefix + "8ball") && msg.includes("event"||"event planning"||"alien"||"ufo")) {
        if (sender.id !== ["186487324517859328","376950284968001556","353782817777385472"]) {
          message.send("No leaks for future events? Open your eyes, chinese man. Rinkky Teases thinks all day and night. He cant keep his mounth shut.")
        }
      };
    
    
    // MUSIC STUFF

    const serverQueue = queue.get(message.guild.id);
    if(message.content.split(" ")[0] === prefix + "play"){
        let args = message.content.split(" ").slice(1)
        const searchString = args.join(' ')
        const voiceChannel = message.member.voiceChannel;
        if(!voiceChannel) return message.channel.send('You need to be in a voice channel to execute this command!')
        const permissions = voiceChannel.permissionsFor(bot.user)
        if(!permissions.has('CONNECT')) return message.channel.send('I can\'t connect here, how do you expect me to play music?')
        if(!permissions.has('SPEAK')) return message.channel.send('I can\'t speak here, how do you expect me to play music?')
	    
	if(!args[0]) return message.reply('Please provide a search term, url or playlist link!')
	if(stopping) stopping = false;
        
        if(args[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
            const playlist = await youtube.getPlaylist(args[0]);
            var videos = await playlist.getVideos();
            for(const video of Object.values(videos)){
                var video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true)
            }
            return await message.channel.send(`Playlist: **${playlist.title}** has been added to the queue!`);
        }else{
            try{
                var video = await youtube.getVideo(args[0])
            }catch(error){
                try{
                    var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    let videosEmbed = new Discord.RichEmbed()
                    .setDescription("Song selection")
                    .setColor(0x15f153)
                    .addField("Songs:", videos.map(video2 => `**${++index} -** ${video2.title}`))
                    message.channel.send(videosEmbed)
                    message.channel.send("Please provide a value from 1 to 10 to select a video! You have 10 seconds")
                    try{
                        var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                      		      	maxMatches: 1,
					time: 10000,
					errors: ['time']
				});
                    }catch(err){
                        return message.channel.send('No value given, or value was invalid, video selection canceled.')
                    }
		    	const videoIndex = parseInt(response.first().content);
                    	var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }catch(err){
                    console.log(err)
                    return await message.channel.send("Sorry bro, cant find any results!");
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if(msg === prefix + "mstop"){
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
	stopping = true;
	serverQueue.voiceChannel.leave();
        return undefined;
    }else if(msg === prefix + "skip"){
            if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
            if(!serverQueue) return await message.channel.send("Nothing is playing!")
	    const voiceChannel = message.member.voiceChannel;
	    for (var x = 0; x < playerVoted.length; x++) {
	    	if(sender === playerVoted[x]){
			return message.channel.send(`${sender.username}, you think you run the place? You cant vote twice!`)
		}
	    }
	    voted++;
	    playerVoted.push(sender);
	    if(voteSkipPass === 0){
		    voiceChannel.members.forEach(function() {
			 voteSkipPass++;
		    })
	    }
	    var voteSkipPass1 = voteSkipPass - 1;
	    var voteSkip = Math.floor(voteSkipPass1/2);
	    if(voteSkip === 0) voteSkip = 1;
	    if(voted >= voteSkip){
		await message.channel.send('Vote skip has passed!')
	    	serverQueue.connection.dispatcher.end();
		voted = 0;
		voteSkipPass = 0;
		playerVoted = [];
	    }else{
	    	await message.channel.send(voted + '\/' + voteSkip + ' players voted to skip!')
	    }
        return undefined;
    }else if(msg === prefix + "np"){
        if(!serverQueue) return await message.channel.send("Nothing is playing!")
        
        return await message.channel.send(`Now playing: **${serverQueue.songs[0].title}**`)
    }else if(msg.split(" ")[0] === prefix + "volume"){
        let args = msg.split(" ").slice(1)
        if(!message.member.voiceChannel) return await message.channel.send("You aren't in a voice channel!")
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        if(!args[0]) return await message.channel.send(`The current volume is **${serverQueue.volume}**`);
	if(args[0] > 10 || args[0] < 0) return await message.channel.send('Please choose a number between 0 and 10!');
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
        serverQueue.volume = args[0];
        return await message.channel.send(`I set the volume to: **${args[0]}**`);
    }else if(msg === prefix + "queue"){
        if(!serverQueue) return await message.channel.send("Nothing is playing!");
        let queueEmbed = new Discord.RichEmbed()
        .setDescription("Queue")
        .setColor(0x15f153)
        .addField("Now playing:", `**${serverQueue.songs[0].title}**`)
        .addField("Songs:", serverQueue.songs.map(song => `**-** ${song.title}`))
        return await message.channel.send(queueEmbed)
    }

      //DM forwarding - draft
      if (message.channel.type == 'dm'){ //checks for DM
        let dmName = `${nick}DM`
        staffchat = member.guild.channels.find('name', 'staff');

        message.staffchat.send({embed: { //forwards DM to staff chat
          color: 0xff0000,
          title: "DM Forwarded" ,
         description: dm.content ,
         timestamp: new Date(),
          footer: {
          icon_url: sender.avatarURL,
          text: `by ${dmName}`
          }
        }})
      };



    //stopping the bot
    if (msg === prefix + 'stop') {
      if(sender.id === "186487324517859328" || message.member.roles.has(Owner.id)) {
        process.exit(1)
      } else {return}
    };

}); //the end of bot.on ------------------------------


/*one time event function
  function onetime(node, type, callback) {
    //create event
    node.addEventListener(type, function(e) {
      //remove event
      e.target.removeEventListener(e, type, arguments.callee)
        //call gandler
        return callback(e)
    })
  } draaaaaft*/

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

async function handleVideo(video, message, voiceChannel, playlist = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
                id: video.id,
                title: video.title,
                url: `https://www.youtube.com/watch?v=${video.id}`
            }
        
    if(!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        message.channel.send(`Yo bro, you wont believe it ${song.title} has been added to the queue`)
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(error)
            queue.delete(message.guild.id)
            return message.channel.send('Sorry bro, there was an error')
        }
    } else {
        serverQueue.songs.push(song);
        if(playlist) return undefined
        return message.channel.send(`Yo bro, you wont believe it ${song.title} has been added to the queue`)
    }
    return undefined;
}

function play(guild, song){
    const serverQueue = queue.get(guild.id)
    if(stopping){
       queue.delete(guild.id);
       return serverQueue.textChannel.send(`I am now leaving, goodbye!`);
    }
    
    if(!song){
	console.log('No song')
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return undefined;
    }
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () =>{
                console.log('Song ended');
		if(!serverQueue.songs){
		        serverQueue.voiceChannel.leave();
        		queue.delete(guild.id);
        		voted = 0;
			voteSkipPass = 0;
			playerVoted = [];
        		return undefined;
		}
		serverQueue.songs.shift();
		voted = 0;
		voteSkipPass = 0;
		playerVoted = [];
                play(guild, serverQueue.songs[0]);
            })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    if(song){
    	serverQueue.textChannel.send(`Now playing: **${song.title}**`)
    }
}

function sortObject() {
	var arr = [];
	for (var prop in userData) {
		if (userData.hasOwnProperty(prop)) {
		    arr.push({
			'key': prop,
			'value': userData[prop].money
		    });
		}
	}
	arr.sort(function(a, b) { return b.value - a.value; });
	return arr;
}

//  Login

// the bot.token('token')
bot.login(process.env.token);
