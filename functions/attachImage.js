
const { MessageAttachment } = require('discord.js')
const path = require('path')
const gif = ['D3PAM']

function attachImage( embed, tournamentOrTrophy ){
    const extension = gif.includes(tournamentOrTrophy.name) ? '.gif' : '.png'
    const name = this.normalize(tournamentOrTrophy.name) + extension
    const thePath = path.resolve( __dirname, '../images', name)
    const attachment = new MessageAttachment(thePath,name)
    embed.attachFiles([ attachment ])
    embed.setImage(`attachment://${name}`)
    return embed
}

module.exports = attachImage