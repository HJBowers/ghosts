const db = require('./db')

function create(data) {
  const query = `
    INSERT INTO
      ghosts(coords, audio, audio_title, user_id)
    VALUES($1, $2, $3, $4)
    RETURNING id;
  `
  return db.query(query, [ data.coords || null, data.audio || null, data.audio_title, data.user_id ])
    .then(response => response.rows[0])
    .catch(err => { console.log(err) })
}

function findById(id) {
  const query = `
    SELECT
      *
    FROM
      ghosts
    WHERE id = $1;
  `
  return db.query(query, [id])
    .then(response => response.rows[0])
    .catch(err => { console.log(err) })
}

module.exports = {
  create,
  findById
}
