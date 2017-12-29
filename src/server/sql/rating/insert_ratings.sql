INSERT INTO ratings (id, rating_type, rating_timestamp, rating)
VALUES (${id}, ${ratingType}, now(), ${rating});
