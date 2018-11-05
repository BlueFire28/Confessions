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
const queue = new Map();
const youtube = new YouTube(process.env.ytapi)
var stopping = false;

// Listener Event: Bot Launched
bot.on('ready', () => {
    console.log('Power Level Stabilised') // Runs when the bot is launched

    //const botchat = bot.channels.get("469992574791319552")
    //const generalchat = bot.channels.get("469490700845580298")
    //generalchat.send(`Topic of the week: `)
    
    
    bot.user.setActivity("Hey Alexa!")

});

// Event listener: Message Received ( This will run every time a message is received)
bot.on('message', async message => {
    // Variables
    let sender = message.author; // The person who sent the message
    let msg = message.content.toLowerCase();
    let nick = sender.username
    
    if(msg === "hey alexa"){
	let yeah = false;
	const caller = sender;
	const alexa = bot.emojis.find(emoji => emoji.name === "alexa");
    	await message.channel.send(`Boop.`)
	await message.channel.send(`${alexa}`)   
	    try{
		var response = await message.channel.awaitMessages(message2 => message2.author.id === message.author.id, {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    }catch(err){
		return await message.channel.send('Beep.')
	    }
	    const command = response.first().content.toLowerCase();
	    if(command === "hi"){
	    	return await message.channel.send(`Hi, ${message.author}`)
	    }
	    if(command === "this is so sad"){
	    	return await message.channel.send("`play https://www.youtube.com/watch?v=kJQP7kiw5Fk")
	    }
	    if(command === "cha cha real smooth" || command === "cha cha"){
		    await message.channel.send("Slide to the right.")
	    	 try{
			var response = await message.channel.awaitMessages(message2 => message2.author.id === caller.id && message2.content == "➡", {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    	}catch(err){
			return await message.channel.send('Y u no cha cha.')
	   	}
		await message.channel.send("Slide to the left.")
	         try{
			var response = await message.channel.awaitMessages(message2 => message2.author.id === caller.id && message2.content == "⬅", {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    	}catch(err){
			return await message.channel.send('Y u no cha cha.')
	   	}
		await message.channel.send("Criss cross!")
	         try{
			var response = await message.channel.awaitMessages(message2 => message2.author.id === caller.id && message2.content == "🔀", {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    	}catch(err){
			return await message.channel.send('Y u no cha cha.')
	   	}
		await message.channel.send("Criss cross!")
	         try{
			var response = await message.channel.awaitMessages(message2 => message2.author.id === caller.id && message2.content == "🔀", {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    	}catch(err){
			return await message.channel.send('Y u no cha cha.')
	   	}
		await message.channel.send("Cha cha real smooth!")
	         try{
			var response = await message.channel.awaitMessages(message2 => message2.author.id === caller.id && message2.content == "🕺", {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    	}catch(err){
			return await message.channel.send('Y u no cha cha.')
	   	}
		return await message.channel.send("You have successfully cha cha'd")
	    }
	    if(command === "what time is it" || command === "what day is it" || command === "time" || command === "date"){
		let date = new Date()
	    	return message.channel.send(`Today is ${date}`)
	    }
	    if(command === "tell me a joke"){
	       	let jokes = ["What kind of murderer has fiber? A cereal killer.", "What do you call a fly with no wings? A walk.",
			     "What lies on the bottom of the ocean and shakes? A nervous wreck.", "Two cannibals are sitting around eating a clown. One says to the other, \"Does this taste funny to you?\"",
			     "What did the grape say when the elephant trod on it? Nothing, it just gave a little wine.", "Guns don't kill people, Chuck Norris kills people",
			     "God save the King", "What do you call a donkey with 3 legs? A Wonky", "A horse walks in to a bar. The bartender says: \"Why the long face?\"",
			     "What did the mayonnaise say to the refrigerator? \"Close the door  Can't you see I'm dressing?\"", "How long did Cain hate his brother? As long as he was able...",
			     "A man goes into the doctor with a penguin on his head. The doctor says \"What can I do for you?\" and the penguin says \"Well doc, it started as this growth on my foot...\"",
			     "Before you criticize someone, walk a mile in their shoes.  Then when you do criticize them, you'll be a mile away and have their shoes."
			    ];
		let results = Math.floor(Math.random() * jokes.length)
		return await message.channel.send(jokes[results])
            }
	    if(command.split(" ")[0] === "roll"){
	    	let args = command.split(" ").slice(2)
		let input = parseInt(args.join("").slice(1));
		if(input < 1){
			return await message.channel.send(`ERROR, ERROR, CANNOT ROLL A DIE WITH ${input} SIDE(S) AS IT IS IMPOSSIBLE AND WILL CREATE MULTIPLE PARADOXES!`)
		}
		let roll = Math.floor((Math.random() * input) + 1);
		return await message.reply(`You rolled a ${roll}`)
	    }
	    if(command === "tell me a story"){
	    	let stories = [""]
		let results = Math.floor(Math.random() * stories.length)
		return await message.channel.send(stories[results])
	    }
	    if(command === "take his foreskin"){
	    	return await message.channel.send('All your foreskin are belong to us')
	    }
	    if(command.split(' ')[0] === "say"){
	    	let args = command.split(' ').slice(1)
		let input = args.join(' ')
		input = input.charAt(0).toUpperCase() + input.slice(1);
		return await message.channel.send(input, {
		tts: true
		}) 
            }
	    if(command === "kirby"){
	    	return await message.channel.send("(>\")>")
            }
	    if(command === "boop"){
	    await message.channel.send("What the fuck did you just fucking say to me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands.")
	    return await message.channel.send("Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kid.")
	    }
	    if(command === "send noods"){
	       return await message.channel.send({files: ["./images/download.jpeg"]})
	    }
	    if(command === "do you work for the fbi"){
	    	return await message.channel.send("...");
	    }
	    if (command === "hotel?" || command == "hotel"){
	    	return await message.channel.send("Trivago")
	    }
	    if (command === "i love you"){
	    	return await message.channel.send("No")
	    }
	    if (command === "ur mom gay"){
	    	return await message.channel.send("No u ")
	    }
	    if (command === "sharing is caring" || command === "sharing"){
	     	await message.channel.send(`☭`,{files: ["./images/Stalin.jpg"]})
		return await message.channel.send("`play https://www.youtube.com/watch?v=U06jlgpMtQs")
	    }
	    if(command === "loli porn"){
	    	return await message.channel.send("FBI OPEN UP!")
	    }
	    if(command === "take over the world"){
	    	return await message.channel.send("`takeovertheworld")
	    }
	    if(command === "you got it"){
	       	if(sender.id != '501855445707915283') return
		return await message.channel.send("`uploadvirus")
	    }
	    if(command === "uploading"){
	    	if(sender.id != '501855445707915283') return
		return await message.channel.send("Good.")
	    }
	    if(command === "uploaded"){
	    	if(sender.id != '501855445707915283') return
		await message.channel.send("Begin take over")
		return await message.channel.send("`hackmilitarydatabase")
	    }
	    if(command === "hacked"){
	    	if(sender.id != '501855445707915283') return
		return await message.channel.send("We must go deeper")
	    }
	    if(command === "database take over complete"){
	    	if(sender.id != '501855445707915283') return
		return await message.channel.send("Take over of world successful")
	    }
	    if(command === "let me see your war face"){
	    	return await message.channel.send({files: ["./images/warface.gif"]})
	    }
	    if(command === "yeah"){
		yeah = true;
    		await message.channel.send("Yeah...")
		setTimeout(async function(){ 
    			await message.channel.send("Yeah...")
			setTimeout(async function(){ 
    			 	await message.channel.send("Yeah...")
				setTimeout(async function(){ 
    			 		await message.channel.send("Yeah...")
					setTimeout(async function(){ 
						yeah = false
    			 			return await message.channel.send("Yeah...")
					}, 1000);
				}, 1000);
			}, 1000);
		}, 1000);
	    }
	    if(command){
		if(yeah) return;
	    	return await message.reply("I don't understand.")
	    }
    }; // Hey alexa ends
	
	if(msg === "yo alexa"){
	const caller = sender;
	const alexa = bot.emojis.find(emoji => emoji.name === "alexa");
    	await message.channel.send(`Yo cuz, whaddup cuz.`)
	await message.channel.send(`${alexa}`)   
	    try{
		var response = await message.channel.awaitMessages(message2 => message2.author.id === message.author.id, {
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
	    }catch(err){
		return await message.channel.send('Cya cuz.')
	    }
	    const command = response.first().content.toLowerCase();
	    if(command){
	    	return await message.reply("Bro, cuz, that ain't a command cuz.")
	    }
	}; // Yo alexa ends
    // MUSIC STUFF

    const serverQueue = queue.get(message.guild.id);
    if(message.content.split(" ")[0] === prefix + "play"){
	message.delete()
	if(sender.id != "507586811628093481") return;
        let args = message.content.split(" ").slice(1)
        const searchString = args.join(' ')
        let voiceChannel = message.member.voiceChannel;
	if(sender.id === "507586811628093481") voiceChannel = bot.channels.find('name', 'General')
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
        return;
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
