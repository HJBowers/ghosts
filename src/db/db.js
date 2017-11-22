const { Client } = require('pg')

const db = new Client(process.env.DATABASE_URL || 'localhost:5432/ghosts')

db.connect()

module.exports = db
