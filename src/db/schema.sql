
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS ghosts;
CREATE TABLE ghosts (
  id SERIAL PRIMARY KEY,
  audio_title VARCHAR(255),
  audio bytea,
  coords JSON,
  user_id INT REFERENCES users,
  date TIMESTAMP default current_timestamp
);

INSERT INTO users (name)
VALUES ('Michael'), ('Sally');