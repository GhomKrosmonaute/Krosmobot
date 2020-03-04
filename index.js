
const { Client, Collection, MessageAttachment } = require('discord.js')
const { createConnection } = require('mysql2')
const { readdir } = require('fs').promises
const path = require('path')
const { token, database, prefix } = require('./config.json')

const commandRegex = new RegExp(`^${prefix}(?:\s*)?([a-z]+)(?:\s*)(.*)(?:\s*)$`,'i')
const commandParser = message => {
    if(!commandRegex.test(message.content)) return false
    const [ , name, argString ] = commandRegex.exec(message.content)
    return { name, args: argString.split(/\s*,\s*/), message }
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
    if(!client.ready || message.system || !message.author) return
    const userCommand = commandParser(message)
    if(!userCommand) return
    const command = client.commands.get(userCommand.name)
    try{
        if(command){
            if(Array.isArray(command)) command[0].bind(message)(userCommand.args)
            else command.bind(message)(userCommand.args)
        }
    }catch(error){
        message.channel.send(`Une erreur est survenue avec la kommande ${userCommand.name}: ${error.message}`).catch()
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



