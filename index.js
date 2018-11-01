// Calling the package
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const moment = require('moment'); // the moment package. to make this work u need to run "npm install moment --save 
const ms = require("ms"); // npm install ms -s
const ytdl = require("ytdl-core");
const opus = require("opusscript");
const YouTube = require("simple-youtube-api")
const prefix = '' // The text before commands

// Okay, i wont worry about it ;)
const queue = new Map();
const youtube = new YouTube(process.env.ytapi)
var stopping = false;

// json files

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
    if (bot.user.id === sender.id) { return }
    let nick = sender.username
    
    if(msg === "hey alexa"){
    	await message.channel.send("Boop.")
	    try{
		var response = await message.channel.awaitMessages(message2 => message2.content, {
				maxMatches: 1,
				time: 10000,
				errors: ['time']
			});
	    }catch(err){
		return message.channel.send('Beep.')
	    }
	    const command = response.first().content.toLowerCase();
	    if(command === "hi"){
	    	message.channel.send(`Hi, @${message.author}`)
	    }
    }
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
