'use strict'

const levels = {
  off: 0,
  fatal: 1,
  error: 2,
  warn: 3,
  info: 4,
  debug: 5
}

let globalLevel = levels.info

module.exports.levels = levels
module.exports.level = lvl => globalLevel = Math.max(Math.min(lvl, levels.debug), levels.off)

const log = level => (from, ...message) => {
  if (level < levels[globalLevel])
    return 
  const date = new Date
  process.stdout.write(
    `${
      date.getFullYear()
    }-${
      date.getMonth().toString().padStart(2, '0')
    }-${
      date.getDate().toString().padStart(2, '0')
    } ${
      date.getHours().toString().padStart(2, '0')
    }:${
      date.getMinutes().toString().padStart(2, '0')
    }:${
      date.getSeconds().toString().padStart(2, '0')
    } [${from}/${level.toUpperCase()}] ` +
      message.join(' ') + require('os').EOL
  )
}

for (let level of ['info', 'debug', 'fatal', 'error', 'warn'])
  module.exports[level] = log(level)

module.exports.from = from => {
  const logger = {}
  for (let level of ['info', 'debug', 'fatal', 'error', 'warn'])
    logger[level] = (...message) => module.exports[level](from, ...message)
  return logger
}
