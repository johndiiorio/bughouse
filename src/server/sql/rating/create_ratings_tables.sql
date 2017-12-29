CREATE TABLE IF NOT EXISTS ratings (
	id SERIAL NOT NULL REFERENCES users(id),
	rating_type rating_type NOT NULL,
	rating_timestamp TIMESTAMP NOT NULL,
	rating REAL NOT NULL,
	PRIMARY KEY (id, rating_timestamp, rating_type)
);

CREATE VIEW most_recent_bullet_ratings AS
SELECT
	u.id,
  rating AS rating
FROM users u
  INNER JOIN (
  SELECT *
  FROM (
    SELECT
      id,
      rating,
      rank()
      OVER (PARTITION BY id ORDER BY rating_timestamp DESC) AS rank
      FROM ratings
      WHERE rating_type = 'bullet'
    ) t
  WHERE rank <= 1
  ) AS r
ON u.id = r.id;

CREATE VIEW most_recent_blitz_ratings AS
SELECT
	u.id,
  rating AS rating
FROM users u
  INNER JOIN (
  SELECT *
  FROM (
    SELECT
      id,
      rating,
      rank()
      OVER (PARTITION BY id ORDER BY rating_timestamp DESC) AS rank
      FROM ratings
      WHERE rating_type = 'blitz'
    ) t
  WHERE rank <= 1
  ) AS r
ON u.id = r.id;

CREATE VIEW most_recent_classical_ratings AS
SELECT
	u.id,
  rating AS rating
FROM users u
  INNER JOIN (
  SELECT *
  FROM (
    SELECT
      id,
      rating,
      rank()
      OVER (PARTITION BY id ORDER BY rating_timestamp DESC) AS rank
      FROM ratings
      WHERE rating_type = 'classical'
    ) t
  WHERE rank <= 1
  ) AS r
ON u.id = r.id
