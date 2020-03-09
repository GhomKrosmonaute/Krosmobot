
const { MessageEmbed } = require('discord.js')

async function victory() {
    const admin = await this.client.fetchAdmin()
    if(admin.id !== this.author.id) return this.channel.send('Cette Kommande est réservée à Ghom :c')
    const alert = await this.channel.send('C\'est pour quel tournoi ?')
    this.client.db.query('SELECT * FROM tournament', async (error, tournaments) => {
        if(error) throw error
        const tournament = await this.client.prompt( this.author, alert,
            message => tournaments.find( t => t.name.toLowerCase().includes(message.content.toLowerCase())),
            message => `Aucun tournoi ne s'appelle "*${message.content}*", réessayez ou tapez **exit**.`
        )
        if(tournament){
            await alert.edit(`Qui a gagné ce tournoi (*${tournament.name}*) ?`)
            let user = await this.client.prompt( this.author, alert,
                message => message.mentions.members.first() || message.mentions.users.first() || this.client.users.resolve(message.content),
                `Je n'ai pas trouvé cet utilisateur... réessayez ou tapez **exit**.`
            )
            if(user){
                user = user.user || user
                const { id: user_id } = await this.client.ensureUser(user)
                return this.client.db.execute(
                    'INSERT INTO victory (tournament_id,user_id) VALUES (?,?)',
                    [tournament.id,user_id],
                    async error => {
                        if(error) throw error
                        const newTrophies = await this.client.checkUserTrophies(tournament,user)
                        const s = newTrophies.length > 1 ? 's' : ''
                        const ere = user.victories > 1 ? 'ème' : 'ère'
                        const embed = new MessageEmbed()
                            .setAuthor(`On a un grand gagnant !`,user.avatarURL({dynamic:true}))
                            .setDescription(`Félicitation ${user} pour ta **${user.victories}${ere}** victoire dans le **${tournament.name}**.`)
                            .setThumbnail(tournament.image)
                        if(newTrophies.length > 0){
                            let lastTrophy = null
                            embed.addField(`Voici le${s} trophée${s} que tu as gagné 😏`, newTrophies
                                .map( trophy => {
                                    lastTrophy = trophy
                                    return (
                                        `Pour **${trophy.requested_victories} victoires** ou plus: ${
                                            this.client.krosmoz.roles.cache.get(trophy.role)
                                        }`
                                    )
                                }).join('\n')
                            )
                            embed.setImage(lastTrophy.image)
                        }
                        alert.edit('Wahou <:wowFace:545209471748538393>', embed).catch()
                    }
                )
            }
        }
        alert.edit('La Kommande a été annulée.').catch()
    })
}

module.exports = victory
