const db = require('./db')

function create(data) {
  const query = `
    INSERT INTO
      ghosts(coords, audio, audio_url, user_id, lat, lng)
    VALUES($1, $2, $3, $4)
    RETURNING id;
  `
  return db.query(query, [ data.coords || null, data.audio || null, data.audio_url || null, data.user_id, data.lat || null, data.lng || null ])
    .then(response => response.rows[0])
    .catch(err => { console.log(err) })
}

function findAll() {
  const query = `
    SELECT
      *
    FROM
      ghosts;
  `
  return db.query(query)
    .then(response => response.rows)
    .catch(err => { console.log(err) })
}

function findByGeo(lat,lng) {
  const query = `
    SELECT
      *
    FROM
      ghosts
    WHERE round(lat,1) = round($1,1)
    AND round(lng,1) = round($2,1);
  `
  return db.query(query, [lat, lng])
    .then(response => response.rows)
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
  findAll,
  findByGeo,
  findById,
}
