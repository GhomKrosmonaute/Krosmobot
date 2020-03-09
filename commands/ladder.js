
const { MessageEmbed } = require('discord.js')

async function ladder(arg){
    let id = /^me|moi|self$/i.test(arg) ? this.author.id : false
    if(arg && !id) id = (
        this.client.users.resolve(arg) ||
        this.mentions.members.first() ||
        this.mentions.users.first() ||
        { id: false }
    ).id
    const embed = new MessageEmbed()
    const ladder = await this.client.fetchLadder()
    if(id){
        const rank = ladder.find( r => r.user.id === id)
        if(rank){
            const position = ladder.indexOf(rank) + 1
            let s = rank.score > 1 ? 's' : ''
            const ere = position > 1 ? 'ème' : 'ère'
            const lui = this.author.id === id ? 'Vous êtes' : 'Ce krosmonaute est'
            embed.setAuthor(`Position de ${rank.user.username}`, rank.user.avatarURL({dynamic:true}))
            const victories = await new Promise( resolve => {
                this.client.db.query(
                    `
                        SELECT t.name
                        FROM victory v
                        LEFT JOIN tournament t
                        ON v.tournament_id = t.id
                        LEFT JOIN user u
                        ON u.id = v.user_id
                        WHERE u.snowflake = ?
                    `,
                    [id],
                    async (error, victories) => {
                        if(error) throw error
                        resolve(victories.map( v => v.name ))
                    }
                )
            })
            const winTournaments = {}
            for(const tournament of victories){
                if(!winTournaments[tournament]){
                    winTournaments[tournament] = 1
                } else winTournaments[tournament] ++
            }
            embed.setDescription(
                `${lui} en **${position}${ere}** position avec un score de **${rank.score}** point${s} !\n${Object.entries(winTournaments).map( entry => {
                    const [ tournament, count ] = entry
                    s = count > 1 ? 's' : ''
                    return `▫️ **${count}** victoire${s} dans le **${tournament}**`
                }).join('\n')}`
            )
        }else{
            this.client.embed404(embed, `${await this.client.users.resolve(id)} n'est pas encore classé.`)
        }
    }else{
        embed.setTitle(`Top ladder du Krosmoz`)
        embed.setDescription(ladder.slice(0,20).map( (rank, index) => {
            const bold = rank.user.id === this.author.id ? '**' : ''
            const position = index + 1
            const s = rank.score > 1 ? 's' : ''
            const ere = position > 1 ? 'ème' : 'er(e)'
            return `${bold}# ${position}${ere} | ${rank.score} pt${s} | ${rank.user.username}${bold}`
        }).join('\n'))
    }
    this.channel.send(embed).catch()
}

module.exports = ladder
