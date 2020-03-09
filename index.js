
const { Client, Collection, MessageAttachment } = require('discord.js')
const { createConnection } = require('mysql2')
const { readdir, readFile } = require('fs').promises
const path = require('path')
const { token, database, prefix } = require('./config.json')

const commandParser = message => {
    if(!message.content.startsWith(prefix)) return false
    const command = message.content.slice(prefix.length)
    const name = command.split(/\s+/)[0]
    const args = command.replace(name,'').trim()
    return { name: name.toLowerCase(), args, message }
}

const client = new Client({
    fetchAllMembers: true,
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: 'Krosmaga',
            type: "PLAYING"
        }
    }
})

client.db = createConnection(database)

client.on('message', message => {
    if(!client.ready || message.system || !message.author || message.author.bot) return
    const userCommand = commandParser(message)
    if(!userCommand) return
    const command = client.commands.get(userCommand.name)
    try{
        if(command) command.bind(message)(userCommand.args)
    }catch(error){
        message.channel.send(`Une erreur est survenue avec la Kommande ${userCommand.name}: ${error.message}`)
    }
})

client.login(token)
    .then(()=>{ console.log('Logged-in') })
    .catch(error=>{ console.error('Not logged-in', error.message) })

client.once('ready', async () => {
    client.commands = new Collection()
    client.krosmoz = client.guilds.cache.get('414529902382153770')
    try{
        const functionDir = await readdir('./functions')
        for(const functionFile of functionDir){
            const functionName = functionFile.replace(/\.js$/,'')
            client[functionName] = require(path.resolve('./functions',functionName))
        }
        const commandDir = await readdir('./commands')
        for(const commandFile of commandDir){
            const commandName = commandFile.replace(/\.js$/,'')
            const command = require(path.resolve('./commands',commandFile))
            client.commands.set(commandName,command)
        }
        client.ready = true
        console.log('Ready')
    }catch(error){
        console.log('Not ready',error.message)
    }
})



