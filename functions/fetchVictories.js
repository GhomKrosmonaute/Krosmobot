
async function fetchVictories( tournament, user ){
    return new Promise( async (resolve, reject) => {
        this.db.execute(`
                SELECT COUNT(v.id) AS victories 
                FROM victory v
                LEFT JOIN user u
                ON u.snowflake = ?
                WHERE v.user_id = u.id 
                AND tournament_id = ?
            `,
            [user.id,tournament.id],
            async (error, results) => {
                if(error) reject(error)
                user.victories = results[0].victories
                resolve(user.victories)
            }
        )
    })

}

module.exports = fetchVictories