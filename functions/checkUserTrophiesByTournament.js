
async function checkUserTrophiesByTournament(tournament, user ) {
    const member = await this.krosmoz.members.fetch({user,cache:true})
    return new Promise( async (resolve, reject) => {
        await this.fetchVictories( tournament, user )
        this.db.execute(
            'SELECT * FROM trophy WHERE tournament_id = ?',
            [tournament.id],
            async (error, trophies) => {
                if(error) reject(error)
                const newTrophies = []
                const sortedTrophies = trophies.sort((a,b) => {
                    return a.requested_victories - b.requested_victories
                })
                for(const trophy of sortedTrophies){
                    if(
                        user.victories >= trophy.requested_victories &&
                        !member.roles.cache.has(trophy.role)
                    ){
                        newTrophies.push(trophy)
                        await member.roles.add(trophy.role)
                    }
                }
                resolve(newTrophies)
            }
        )
    })
}

module.exports = checkUserTrophiesByTournament
