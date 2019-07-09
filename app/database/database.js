/*
******************************************************
 * Copyright (C) 2019 Tomás Caram <aresmta@gmail.com>
 *
 * Released under GNU General Public License v3.0
 * Written by Tomás Caram <aresmta@gmail.com>, January 2019
 *******************************************************
*/

const con = require('../database/database.init.js')

module.exports = {
  addQuestion: async function (discordId, messageSnowflake, text) {
    return new Promise((resolve, reject) => {
      con.query(`INSERT INTO questions (id, issued_by, message_snowflake, text, timestamp, state) VALUES (NULL, ${discordId}, ${messageSnowflake}, ${con.escape(text)}, NULL, 1)`,
        function (err, result) {
          if (err) throw err
          resolve(result.insertId)
        })
    })
  },

  addAnswer: function (discordId, messageSnowflake, parentQuestion, text) {
    con.query(`INSERT INTO answers (id, issued_by, message_snowflake, parent_question, text, timestamp, state) VALUES (NULL, ${discordId}, ${messageSnowflake}, ${parentQuestion}, ${con.escape(text)}, NULL, 1)`,
      function (err, result) {
        if (err) throw err
      })
  },
  
  questionExists: async function (questionId) {
    return new Promise((resolve, reject) => {
      con.query(`SELECT * FROM questions WHERE id = ${con.escape(questionId)}`,
        function (err, result) {
          if (err) throw err
          resolve((result.length !== 0) ? result[0] : false)
        })
    })
  },

  getQuestionFromAnswerSnowflake: async function (messageSnowflake) {
    return new Promise((resolve, reject) => {
      con.query(`SELECT parent_question FROM answers WHERE message_snowflake = ${con.escape(messageSnowflake)}`,
        function (err, result) {
          if (err) throw err
          resolve((result[0].parent_question !== 0) ? result[0].parent_question : false)
        })
    })
  }
}
