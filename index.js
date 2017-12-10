const { promisify } = require('util')
const path = require('path')
const fs = require('fs')

const client = require('eris')(process.env.VERIFIER_TOKEN)
const logger = require('./logger').from("main")

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const appendFile = promisify(fs.appendFile)

client.on('messageCreate', async message => {
  if (message.content.startsWith('!verify') && message.member && message.member.roles.filter(role => role === '352785124540153868').length > 0)
    return
  if (message.content.startsWith('!verify')) {
    const { author: user, channel } = message
    const guild = channel.guild
    try {
      const [, acronym] = /(\w{4}\d{2})/i.exec(message.content.substring(7))
      const acronymes = await readFile(path.resolve(__dirname, 'acronyms.txt'), 'utf8')

      const index = acronymes.indexOf(acronym)
      if (!~index) {
        return logger.error(`User ${user.username} with id ${user.id} used acronym ${acronym} but it does not exist in our list`)
      } else if (~(await readFile(path.resolve(__dirname, 'registrerade.txt'), 'utf8')).indexOf(acronym)) {
        client.createMessage(channel.id, 'Någon har redan registrerat det acronymet')
        return logger.error(`User ${user.username} with id ${user.id} tried to use a already registered acronym ${acronym}`)
      }
      guild.addMemberRole(user.id, '352785124540153868', `${user.username} (${user.id}) verifierades med ${acronym}`)
      appendFile(path.resolve(__dirname, 'registrerade.txt'), acronym + '\n', 'utf8')
      client.createMessage(channel.id, user.mention + ' har blivit verifierad.')
      logger.info(`User ${user.username} with id ${user.id} got verified with acronym ${acronym}`)
    } catch (e) {
      logger.error(`User ${user.username} with id ${user.id} used a invalid acronym`)
    }
  }
})

client.connect()
