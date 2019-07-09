/*
******************************************************
 * Copyright (C) 2019 Tomás Caram <aresmta@gmail.com>
 *
 * Released under GNU General Public License v3.0
 * Written by Tomás Caram <aresmta@gmail.com>, January 2019
 *******************************************************
*/

const config = require('../../config/config.js')
const mysql = require('mysql')

var pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db_name,
  charset: config.database.charset
})

pool.query = function () {
  // Credits Adam Yost (https://stackoverflow.com/a/30914967)
  var sqlArgs = []
  var args = []
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  var callback = args[args.length - 1] // last arg is callback
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
      return callback(err)
    } if (args.length > 2) {
      sqlArgs = args[1]
    }
    connection.query(args[0], sqlArgs, function (err, results) {
      connection.release() // always put connection back in pool after last query
      if (err) {
        console.log(err)
        return callback(err)
      }
      callback(null, results)
    })
  })
}

module.exports = {
  query: pool.query,
  escape: mysql.escape
}
