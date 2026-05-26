# v-r-api-nettside
# Verdens temperaturer 

Et enkelt webprosjekt som viser sanntidstemperaturer for flere byer ved hjelp av værdata fra MET Norway API.

Prosjektet består av:

- Frontend i ren HTML/CSS/JavaScript
- Backend med Express.js som fungerer som proxy mot MET API
- Dynamisk oppdatering av temperaturdata

---

## Funksjoner

- Henter temperaturdata for flere byer
- Viser temperatur i responsive kort
- Automatisk oppdatering ved lasting av siden
- Backend-proxy for å unngå CORS-problemer
- Bruker offisiell værdata fra MET Norway

---

## Teknologier

- Node.js
- Express
- node-fetch
- HTML
- CSS
- JavaScript
- MET Norway Locationforecast API

---

## Prosjektstruktur

.
├── server.js
├── public
│   └── index.html
└── package.json

> Merk:
> `index.html` bør ligge i `public`-mappen siden Express bruker:
>
> ```js
> app.use(express.static("public"));
> ```

---
