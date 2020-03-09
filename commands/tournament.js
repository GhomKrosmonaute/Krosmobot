
const { MessageEmbed } = require('discord.js')
const { prefix } = require('../config.json')

function tournamentCommand( args ){
    if(!args || !args.trim()) return this.channel.send('Il manque un argument a votre Kommande.')
    args = args.trim().toLowerCase()
    this.client.db.query(
        'SELECT * FROM tournament',
        async (error, tournaments) => {
            if(error) throw error
            const embed = new MessageEmbed()
            if(/list/i.test(args)){
                embed.setTitle(`Liste des ${tournaments.length} tournois du Krosmoz`)
                embed.setDescription(`Faites la kommande \`${prefix}tournament <tournois>\` pour afficher les détais.`)
                for(const tournament of tournaments)
                    embed.addField(
                        tournament.name,
                        tournament.description,
                        false
                    )
            }else{
                const tournament = tournaments.find( t => {
                    return t.name.toLowerCase().includes(args)
                })
                if(tournament){
                    embed.setTitle(tournament.name)
                    embed.setDescription(tournament.description)
                    embed.setThumbnail(tournament.image)
                    const trophies = await new Promise( resolve => {
                        this.client.db.query(
                            'SELECT * FROM trophy WHERE tournament_id = ?',
                            [tournament.id],
                            (error, trophies) => {
                                if(error) throw error
                                resolve(trophies)
                            }
                        )
                    })
                    if(trophies.length > 0){
                        embed.addField('Les trophées pour ce tournoi','Vous pouvez obtenir ces trophées en remportant la première place du tournoi.', false)
                        for(const trophy of trophies){
                            if(trophy.image)
                                embed.setImage(trophy.image)
                            embed.addField(
                                trophy.name,
                                `Requiert ${trophy.requested_victories} victoires.\nRole: <@&${trophy.role}>`,
                                false
                            )
                        }
                    }
                }else{
                    this.client.embed404(embed,`Aucun tournoi ne contient "${args}" dans son nom...`)
                }
            }
            return this.channel.send(embed)
        }
    )
}

module.exports = tournamentCommand
