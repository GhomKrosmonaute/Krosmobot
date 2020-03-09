
async function init(args){
    const admin = await this.client.fetchAdmin()
    if(admin.id !== this.author.id) return this.channel.send('Cette Kommande est réservée à Ghom :c')
    const alert = await this.channel.send(`<a:wait:560972897376665600> Connection à Incarnam...`)
    this.client.db.query('DELETE FROM victory', error => { if(error) throw error })
    this.client.db.query('SELECT * FROM trophy',async (error, trophies) => {
        if(error) throw error
        const members = this.client.krosmoz.members.cache.array()
        for(const member of members){
            const memberTrophies = trophies.filter( trophy => {
                return member.roles.cache.has(trophy.role)
            })
            for(const memberTrophy of memberTrophies){
                let user_id = (await new Promise( resolve => {
                    this.client.db.execute(
                        'INSERT IGNORE INTO user (snowflake) VALUES (?)',
                        [member.id],
                        (error, response) => {
                            if(error) throw error
                            resolve(response.insertId)
                        }
                    )
                })) || await new Promise( resolve => {
                    this.client.db.query(
                        'SELECT id FROM user WHERE snowflake = ?',
                        [member.id],
                        (error, result) => {
                            if(error) throw error
                            resolve(result[0].id)
                        }
                    )
                })
                await new Promise( resolve => {
                    this.client.db.execute(
                        'INSERT INTO victory (tournament_id,user_id) VALUES (?,?)',
                        [memberTrophy.tournament_id,user_id],
                        (error) => {
                            if(error) throw error
                            resolve(true)
                        }
                    )
                })
            }
        }
        alert.edit('<:yay:557124850326437888> Le Krosmoz est initialisé.').catch()
    })

}

module.exports = init
