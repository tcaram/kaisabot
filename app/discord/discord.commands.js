/*
******************************************************
 * Copyright (C) 2019 Tomás Caram <aresmta@gmail.com>
 *
 * Released under GNU General Public License v3.0
 * Written by Tomás Caram <aresmta@gmail.com>, January 2019
 *******************************************************
*/

const config = require('../../config/config.js')
const database = require('../database/database.js')

var client = null

function context (c) {
  client = c
}

function destroyMessage (msg) {
  msg.delete()
}

function unrecognized (msg) {
  msg.reply(`Unrecognized command.`).then(_msg => {
    setTimeout(destroyMessage, 5000, _msg)
    setTimeout(destroyMessage, 5000, msg)
  })
}

async function ask (msg, syntax) {
  var content = msg.content
  var author = msg.author
  var mentions = msg.mentions.users.first() || msg.mentions.roles.first() || msg.mentions.everyone

  var splitContent = content.split(' ')
  if (!content.includes(' ') || splitContent.length < 2) {
    msg.reply(`Syntax: ${syntax}.`).then(_msg => {
      setTimeout(destroyMessage, 10000, msg)
      setTimeout(destroyMessage, 10000, _msg)
    })
    return
  }

  if (mentions) {
    msg.reply('Questions cannot contain mentions.').then(_msg => {
      setTimeout(destroyMessage, 10000, msg)
      setTimeout(destroyMessage, 10000, _msg)
    })
    return
  }

  splitContent[0] = undefined
  var question = splitContent.join(' ').trim()

  msg.delete()
  msg.channel.send('Placeholder', { reply: false }).then(async _msg => {
    var id = await database.addQuestion(author.id, _msg.id, question)
    _msg.edit(`\`Question ID #${id}\` by ${author}: ${question}`)
  })
}

async function answer (msg, syntax) {
  var content = msg.content
  var author = msg.author
  var mentions = msg.mentions.users.first() || msg.mentions.roles.first() || msg.mentions.everyone

  var splitContent = content.split(' ')
  if (!content.includes(' ') || splitContent.length < 3) {
    msg.reply(`Syntax: ${syntax}.`).then(_msg => {
      setTimeout(destroyMessage, 10000, msg)
      setTimeout(destroyMessage, 10000, _msg)
    })
    return
  }

  if (mentions) {
    msg.reply('Answers cannot contain mentions.').then(_msg => {
      setTimeout(destroyMessage, 10000, msg)
      setTimeout(destroyMessage, 10000, _msg)
    })
    return
  }

  var questionId = splitContent[1]

  var questionExists = await database.questionExists(questionId)
  if (questionExists) {
    splitContent[0] = undefined
    splitContent[1] = undefined
    var answer = splitContent.join(' ').trim()
    msg.channel.send(`Answer by ${author} to question #${questionId}: \`\`\`${questionExists.text}\`\`\` \`\`\`${answer}\`\`\``).then(_msg => {
      msg.delete()
      _msg.react('👍')
      database.addAnswer(author.id, _msg.id, questionId, answer)
    })
  } else {
    msg.reply('Could not find a question matching this ID.').then(_msg => {
      setTimeout(destroyMessage, 10000, msg)
      setTimeout(destroyMessage, 10000, _msg)
    })
  }
}

var commands = {
  // command: [function, syntax, allowedChannel]
  ask: [ask, '%command% pregunta', config.discord.channels.questions],
  answer: [answer, '%command% id respuesta', config.discord.channels.answers]
}

function commandsHandler (command, msg, output = true) {
  if (!(command in commands)) {
    return null
  }

  var theFunction = commands[command][0]
  var syntax = commands[command][1]
  var allowedChannel = commands[command][2]

  var member = msg.member

  if (allowedChannel && (allowedChannel !== msg.channel.id)) {
    if (output) {
      msg.reply(`This command is meant to be ussed in <#${allowedChannel}>.`).then(_msg => {
        setTimeout(destroyMessage, 10000, _msg)
        setTimeout(destroyMessage, 10000, msg)
      })
    }
    return false
  }

  syntax = syntax.replace('%command%', config.discord.command_prefix + command)
  syntax = '`' + syntax + '`'

  return [theFunction, msg, syntax]
}

module.exports = {
  commandsHandler: commandsHandler,
  unrecognized: unrecognized,
  context: context
}
