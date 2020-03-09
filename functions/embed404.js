
function embed404(embed, message){
    embed.setTitle('Raté !')
    embed.setDescription(message)
    embed.setImage('https://static.ankama.com/ankama/www/modules/assets/404.jpg')
    return embed
}

module.exports = embed404
