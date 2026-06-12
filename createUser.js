// Kjør én gang for å lage bruker: node createUser.js
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUser(username, password) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME
  });
  const hash = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
  console.log(`✓ Bruker "${username}" opprettet!`);
  await db.end();
}

createUser('Hammis', 'passord123');