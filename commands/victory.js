
const { MessageEmbed } = require('discord.js')

module.exports = async function victory() {
    const admin = await this.client.fetchAdmin()
    if(admin.id !== this.author.id) return this.channel.send('Cette Kommande est réservée à Ghom :c')
    const alert = await this.channel.send('C\'est pour quel tournoi ?')
    this.client.db.query('SELECT * FROM tournament',async (error, tournaments) => {
        if(error) throw error
        const tournament = await this.client.prompt( alert,
            message => tournaments.find( t => t.name.toLowerCase().includes(message.content.toLowerCase())),
            message => `Aucun tournoi ne s'appelle "*${message.content}*", réessayez ou tapez **exit**.`
        )
        if(tournament){
            await alert.edit(`Qui a gagné ce tournoi (*${tournament.name}*) ?`)
            const user = await this.client.prompt( alert,
                message => message.mentions.members.first() || message.mentions.users.first() || this.client.users.resolve(message.content),
                `Je n'ai pas trouvé cet utilisateur... réessayez ou tapez **exit**.`
            )
            if(user){
                return this.client.db.execute(
                    'INSERT INTO victory (tournament_id,user_id) VALUES (?,?)',
                    [tournament.id,user.id],
                    async (error) => {
                        if(error) throw error
                        const embed = new MessageEmbed()
                            .setTitle(`On a un grand gagnant !`)
                            .setDescription(`Félicitation à ${user} pour sa victoire dans le **${tournament.name}**.`)
                            .setThumbnail(user.avatarURL || user.user.avatarURL)
                        this.client.attachImage(embed,tournament)
                        alert.edit(embed).catch()
                    }
                )
            }
        }
        alert.edit('La Kommande a été annulée.').catch()
    })

}