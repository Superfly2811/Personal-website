# Personal Website

En personlig nettside med væroversikt og todo-liste, med innloggingssystem koblet til MariaDB.

## Funksjoner

- Innlogging med brukernavn og passord
- Sanntids temperaturoversikt for Oslo, London og New York (via yr.no API)
- Todo-liste med statussporing (Å gjøre / Ferdig)
- Passord lagres kryptert i databasen (bcrypt)

## Teknologi

- **Frontend:** HTML, JavaScript
- **Backend:** Node.js / Express
- **Database:** MariaDB
- **Autentisering:** express-session, bcryptjs

## Kom i gang

### Krav

- Node.js
- MariaDB (på VM)

### Installasjon

1. Klon repoet:
   ```bash
   git clone https://github.com/Superfly2811/Personal-website.git
   cd Personal-website
   ```

2. Installer avhengigheter:
   ```bash
   npm install
   ```

3. Opprett `.env`-fil (se `.env.example`):
   ```env
   DB_HOST=din-database-ip
   DB_USER=din-bruker
   DB_PASSWORD=ditt-passord
   DB_NAME=eksamen_db
   DB_PORT=3306
   SESSION_SECRET=enLangTilfeldigStreng
   ```

4. Opprett tabellen i databasen:
   ```bash
   mysql -u root -p eksamen_db < setup.sql
   ```

5. Lag en bruker:
   ```bash
   node createUser.js
   ```

6. Start serveren:
   ```bash
   node server.js
   ```

7. Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

## Filstruktur

```
├── server.js         # Express-server med ruter og autentisering
├── createUser.js     # Script for å opprette bruker i databasen
├── .env              # Miljøvariabler (skal ikke pushes til GitHub)
└── public/
    ├── index.html    # Hovedside (væroversikt + todo)
    └── login.html    # Innloggingsside
```

## Sikkerhet

- `.env` er lagt til i `.gitignore` og pushes aldri til GitHub
- Passord hashes med bcrypt før lagring
- Alle sider krever innlogging