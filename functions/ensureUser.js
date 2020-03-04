
module.exports = function(user){
    return new Promise( resolve => {
        this.db.execute(
            'SELECT * FROM `user` WHERE snowflake = ?',
            [user.id],
            (error, results) => {
                if(results.length > 0) resolve(results[0])
                else this.db.execute(
                    'INSERT INTO `user` (snowflake) VALUES (?)',
                    [user.id],
                    (error, result) => {
                        if(error) throw error
                        resolve({ id: result.insertId })
                    }
                )
            }
        )
    })
}