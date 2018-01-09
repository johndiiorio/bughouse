UPDATE users
SET reset_token = ${resetToken}
WHERE id = ${id}
