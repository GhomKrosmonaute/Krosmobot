
module.exports = async function prompt(author,alert,filter,failMessage){
    let result = true
    while(result === true){
        result = await new Promise( resolve => {
            this.once('message', async message => {
                if(
                    message.system || !message.author ||
                    author.id !== message.author.id ||
                    alert.channel.id !== message.channel.id
                ) return resolve(true)
                await message.delete()
                if(/cancel|exit/i.test(message.content)) return resolve(false)
                const item = await filter(message)
                if(item) return resolve(item)
                else await alert.edit(typeof failMessage === 'string' ? failMessage : failMessage(message))
                resolve(true)
            })
        })
    }
    return result
}