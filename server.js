const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');


const app = express();
app.use(cors());

const USER_AGENT = "MyApp/1.0 (+din-epost@domain.com)";



app.get('/weather', async (req, res) => {
const lat = req.query.lat;
const lon = req.query.lon;
if(!lat || !lon) return res.status(400).json({error:'Missing lat/lon'});


const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;


try{
const resp = await fetch(url, {
headers: {
'User-Agent': USER_AGENT,
'Accept': 'application/geo+json, application/json'
}
});


const body = await resp.text();
res.status(resp.status).type('application/json').send(body);
}catch(err){
console.error('proxy error', err);
res.status(502).json({error:'Proxy error', detail: err.message});
}
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));