INSERT INTO users (username, email, password_hash, registration_timestamp)
VALUES (${username}, ${email}, ${passwordHash}, now())
ON CONFLICT(username) DO NOTHING
RETURNING id;
