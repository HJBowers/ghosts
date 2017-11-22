const { Client } = require('pg')

const db = new Client({
  
  host: process.env.DBHOST || "localhost",
  port: process.env.DBPORT || 5432,
  database: process.env.DBNAME || "ghosts",
  user: process.env.DBUSER || ''
  password: process.env.DBPASS || ''
})

db.connect()

module.exports = db
