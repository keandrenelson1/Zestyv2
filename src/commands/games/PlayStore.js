const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const play = require('google-play-scraper');
module.exports = class PlayStoreCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'playstore',
      aliases: ['plst'],
      usage: 'playstore <app>',
      description: 'Show the information of any app in the PlayStore.',
      type: client.types.GAMES,
      examples: ['playstore Geometry Dash']
    });
  }
  run(message, args) {
    const { htmlToString } = message.client.utils;
     const app = args.join(" ")
     if(message.author.bot){
      return;
     }
     if(!app){
         return message.channel.send('Please put any application you want me to search')
     }
     play.search({
         term: app,
         num: 1
         }).then(as =>{
     play.app({appId: as[0].appId}).then(res => {
       
         const embed = new MessageEmbed()
         .setTitle(res.title)
         .setURL(res.url)
         .setColor(message.guild.me.displayHexColor)
         .setThumbnail(res.icon)
         .setImage(res.screenshots[0])
         .addField('Description',res.summary, true)
         .addField('Price',res.priceText, true)
         .addField('Rating',res.scoreText, true)
         .addField('Downloads',res.installs, true)
         .addField('Type', res.genre, true)
         .addField('Last update', htmlToString(res.recentChanges))
         .addField('Released',res.released)
         .setFooter(
           {
             text: 'Developer: '+res.developer+' '+'Email: '+res.developerEmail+' '+'Web: '+res.developerWebsite+' '+'ID: ' +res.developerId
           }
         )
         .setTimestamp()
         message.channel.send({embeds: [embed]});

     }).catch(() => {
         message.channel.send({
           content: 'No results found for '+app
         })
     })
 }) 
  }
};
