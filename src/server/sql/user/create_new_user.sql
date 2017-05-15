INSERT INTO users (username, email, password_hash)
VALUES (${username}, ${email}, ${passwordHash})
ON CONFLICT(username) DO NOTHING
RETURNING id;
