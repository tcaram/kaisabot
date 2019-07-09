/*
******************************************************
 * Copyright (C) 2019 Tomás Caram <aresmta@gmail.com>
 *
 * Released under GNU General Public License v3.0
 * Written by Tomás Caram <aresmta@gmail.com>, January 2019
 *******************************************************
*/

const config = {
  database: {
    host: 'localhost',
    user: 'root',
    password: '',
    // password: '',
    db_name: 'qna',
    charset: 'utf8mb4'
  },
  discord: {
    server_id: '534140812943032321',
    channels: {
      questions: '534141707055267840',
      answers: '534141752857067552'
    },
    command_prefix: '.',
    token: ''
  }
}

module.exports = config
