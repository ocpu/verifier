const Eris = require('eris')
const fs = require('fs')
const path = require('path')

const bot = new Eris(process.env.verifier_bot)

const verifiedRoleId = "352785124540153868"
// const timeoutRoleId = "355002513537237021"
                    // 234676929263828993
// const timeoutLimit = 4

// const users = {
//     // [id]: (times executed)
// }

bot.on('messageCreate', message => {
    // if (message.content.startsWith('!verify')) {
    //     if (!(message.author.id in users)) {
    //         setTimeout(() => {
    //             const guild = bot.getChannel(message.channel.id).guild
    //             const members = guild.members
    //             const member = members.find(member => member.id === message.author.id)
    //             if (users[member.id] > timeoutLimit) {
    //                 const roles = member.roles
    //                 roles.forEach(role => {
    //                     member.removeRole(role, 'Timeout set')
    //                 })
    //                 member.addRole(timeoutRoleId, 'Timeout set')
    //                 setTimeout(() => {
    //                     roles.forEach(role => {
    //                         member.addRole(member.id, role, 'Timeout expired')
    //                     });
    //                     member.removeRole(timeoutRoleId, 'Timeout expired')
    //                 }, 8000)
    //             } else users[member.id] = void 0
    //         }, 5000)
    //         users[message.author.id] = 1
    //     } else users[message.author.id]++
    // }
    if (message.content.startsWith('!verify') && message.member && message.member.roles.filter(role => role === verifiedRoleId).length > 0)
        return bot.createMessage(message.channel.id, 'Du är redan verifierad.')
    if (message.content.startsWith('!verify')) {
        try {
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
            message.channel.guild.addMemberRole(message.author.id, verifiedRoleId, `${message.author.username} (${message.author.id}) verifierades med ${acronym}`)
            bot.createMessage(message.channel.id, 'Du har blivit verifierad.')
        } catch (e) {
            bot.createMessage(message.channel.id, 'Va? Nej? Varför skulle du testa det...')
        }
    }
})

bot.connect()
