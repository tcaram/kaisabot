/*
******************************************************
 * Copyright (C) 2019 Tomás Caram <aresmta@gmail.com>
 *
 * Released under GNU General Public License v3.0
 * Written by Tomás Caram <aresmta@gmail.com>, January 2019
 *******************************************************
*/

const config = require('../config/config.js')
const commands = require('./discord/discord.commands.js')
const database = require('./database/database.js')

const discord = require('discord.js')
const client = new discord.Client()

client.on('message', msg => {
  if (msg.channel.type === 'text' && msg.author.id !== client.user.id) {
    if (msg.channel.id === config.discord.channels.questions || msg.channel.id === config.discord.channels.answers) {
      var command = msg.content.split(' ')[0]
      command = command.replace(config.discord.command_prefix, '')
      var handler = commands.commandsHandler(command, msg)
      if (handler) {
        handler[0](handler[1], handler[2])
      } else if (handler == null) {
        commands.unrecognized(msg)
      }
    }
  }
})

client.on('messageReactionAdd', async (messageReaction, user) => {
  // console.log('reaction added')
  var questionId = await database.getQuestionFromAnswerSnowflake(messageReaction.message.id)
  var questionData = await database.questionExists(questionId)

  var issuedBy = questionData.issued_by

  if (issuedBy === user.id) {
    messageReaction.remove(user)
  }
})

client.on('error', (error, fileName, lineNumber) => {
  console.log(`**Client error**: ${error.message}, at ${fileName}:${lineNumber}`)
})

client.on('warning', info => {
  console.log(`**Client warning**: ${info}`)
})

client.on('ready', () => {
  client.guilds.get(config.discord.server_id).channels.get(config.discord.channels.answers).fetchMessages({ limit: 100 })
  console.log(`Logged in as ${client.user.tag}!`)
  commands.context(client)
})

client.login(config.discord.token).catch((e) => {
  console.log(e)
})
