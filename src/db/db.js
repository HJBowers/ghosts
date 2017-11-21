const { Client } = require('pg')

const db = new Client({
  host: process.env.DBHOST || "localhost",
  port: process.env.DBPORT || 5432,
  database: process.env.DBNAME || "ghosts"
})

db.connect()

module.exports = db