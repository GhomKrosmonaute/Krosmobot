
const { fetchUser } = require('krosmap')
const { MessageEmbed } = require('discord.js')

function krosmap( arg ){
    const embed = new MessageEmbed()
    if(!arg) return this.channel.send(this.client.embed404(embed,'Vous devez entrer un pseudo Ankama correct.'))
    fetchUser(arg)
        .then( user => {
            if(user.profile){
                embed.setAuthor('Profile de ' + user.profile.username, user.profile.avatar)
                embed.setDescription(user.profile.description.replace('&nbsp;',' ').trim())
            }
            if(user.global) embed.addField('Global', Object.entries(user.global).map( entry => `${entry[0]}: **${entry[1]}**` ).join('\n'), true)
            if(user.lastSeason) embed.addField('Last season', Object.entries(user.lastSeason).map( entry => `${entry[0]}: **${entry[1]}**` ).join('\n'), true)
            return this.channel.send(embed)
        })
        .catch()
}

module.exports = krosmap
