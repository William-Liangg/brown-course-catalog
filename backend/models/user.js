const { query } = require('../db');

async function findUserByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser(email, password_hash) {
  const result = await query('INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, password_hash]);
  return result.rows[0];
}

module.exports = { findUserByEmail, createUser }; 