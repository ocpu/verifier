const Eris = require('eris')
const fs = require('fs')
const path = require('path')

const bot = new Eris(process.env.verifier_bot)

bot.on('messageCreate', message => {
    if (message.content.startsWith('!verify')) {
        const [, acronym] = /(\w{4}\d{2})/i.exec(message.content.substring(7))
        const c = fs.readFileSync(path.resolve(__dirname, 'acronyms.txt'), 'utf8')
        const i = c.indexOf(acronym)
        if (!~i) {
            if (!!~fs.readFileSync(path.resolve(__dirname, 'registrerade.txt'), 'utf8').indexOf(acronym))
                return bot.createMessage(message.channel.id, 'Någon har redan blivit registrerat sig med det acronymet. Kontakta <@112287082717745152> eller <@234676929263828993> för mer info.')
            return bot.createMessage(message.channel.id, 'Du är inte en student i webbprogrammering på bth från 2017')
        }
        console.log(`Student med acronym ${acronym} är nu registrerad!`)
        fs.writeFileSync(path.resolve(__dirname, 'acronyms.txt'), c.substring(0, i) + c.substring(i + 6), 'utf8')
        message.channel.guild.addMemberRole(message.author.id, "352785124540153868", `${message.author.username} (${message.author.id}) verifierades med ${acronym}`)
        bot.createMessage(message.channel.id, 'Du har blivit verifierad.')
    }
})

bot.connect()
