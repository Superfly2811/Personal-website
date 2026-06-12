const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'xK9mP2qL8nR5vT3wY7zA',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 timer
}));

// Database-tilkobling
const db = mysql.createPool({
  host:     process.env.DB_HOST     || '192.168.64.3',
  user:     process.env.DB_USER     || 'minbruker',
  password: process.env.DB_PASSWORD || 'passord123',
  database: process.env.DB_NAME     || 'eksamen_db',
  port:     process.env.DB_PORT     || 3306
});

// Middleware: krev innlogging
function requireLogin(req, res, next) {
  if (req.session && req.session.user) return next();
  res.redirect('/login');
}

const USER_AGENT = "MyApp/1.0 (+din-epost@domain.com)";

// ── Værrute (krever innlogging) ──
app.get('/weather', requireLogin, async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/geo+json, application/json'
      }
    });
    const body = await resp.text();
    res.status(resp.status).type('application/json').send(body);
  } catch (err) {
    console.error('proxy error', err);
    res.status(502).json({ error: 'Proxy error', detail: err.message });
  }
});

// ── Login-side ──
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.sendFile(__dirname + '/public/login.html');
});

// ── Logg inn ──
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Feil brukernavn eller passord' });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Feil brukernavn eller passord' });

    req.session.user = { id: rows[0].id, username: rows[0].username };
    res.json({ success: true, redirect: '/' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Serverfeil' });
  }
});

// ── Logg ut ──
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// ── Hvem er logget inn? (brukes av frontend) ──
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user.username });
  } else {
    res.status(401).json({ error: 'Ikke logget inn' });
  }
});

// ── Statiske filer (krever innlogging for rot-ruten) ──
app.get('/', requireLogin, (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
