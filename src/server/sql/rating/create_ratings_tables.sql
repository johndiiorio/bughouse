CREATE TABLE IF NOT EXISTS ratings (
	user_id SERIAL NOT NULL REFERENCES users(id),
	rating_type rating_type NOT NULL,
	rating_timestamp TIMESTAMP NOT NULL,
	rating REAL NOT NULL,
	PRIMARY KEY (user_id, rating_timestamp, rating_type)
);

CREATE VIEW most_recent_ratings AS
SELECT
  new_ratings.user_id AS user_id,
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'bullet') AS rating_bullet,
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'blitz') AS rating_blitz,
  MAX(new_ratings.rating) FILTER(WHERE new_ratings.rating_type = 'classical') AS rating_classical
FROM
  (
    SELECT
      DISTINCT ON (u.id, rts.rating_type)
      u.id as user_id,
      rts.rating_type as rating_type,
      rts.rating as rating
    FROM users u
    LEFT JOIN ratings rts ON u.id = rts.user_id
    ORDER BY u.id, rts.rating_type, rts.rating_timestamp
  ) new_ratings
GROUP BY new_ratings.user_id;
