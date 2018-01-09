UPDATE users
SET (password_hash, reset_token) = (${passwordHash}, NULL)
WHERE id = ${id};
