INSERT INTO users (username, email, password_hash)
VALUES (${username}, ${email}, ${passwordHash})
RETURNING id;
