
async function fetchLadder(){
    return new Promise( (resolve, reject) => {
        this.db.query(
            `
                SELECT
                    COUNT(v.id) AS victories,
                    u.snowflake AS id,
                    u.score
                FROM user u
                LEFT JOIN victory v
                ON v.user_id = u.id
                GROUP BY u.id
            `,
            (error, results) => {
                if(error) reject(error)
                resolve(
                    results
                        .map( result => {
                            return {
                                user: this.users.cache.get(result.id),
                                score: result.score + result.victories
                            }
                        })
                        .sort((a,b) => {
                            return b.score - a.score
                        })
                )
            }
        )
    })
}

module.exports = fetchLadder
