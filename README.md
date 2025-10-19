# 🚌 Cotral Server API

<div align="center">
  <img src="logo.png" alt="CotralServerAPI" width="200">
</div>

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/ChromuSx)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/chromus)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/chromus)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/giovanniguarino1999)

**API REST per l'accesso ai dati del trasporto pubblico Cotral**

[Documentazione API](./OpenAPI.yaml) · [Segnala Bug](https://github.com/ChromuSx/cotral-server-api/issues)

</div>

## 📋 Indice

- [Descrizione](#-descrizione)
- [Caratteristiche](#-caratteristiche)
- [Architettura](#-architettura)
- [Prerequisiti](#-prerequisiti)
- [Installazione](#-installazione)
- [Configurazione](#-configurazione)
- [API Endpoints](#-api-endpoints)
- [Esempi](#-esempi)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contribuire](#-contribuire)
- [Licenza](#-licenza)

## 📝 Descrizione

Cotral Server API è un servizio backend TypeScript che funge da layer intermedio per le API ufficiali di Cotral (`http://travel.mob.cotralspa.it:7777/beApp`). Il servizio trasforma le risposte XML native in JSON strutturato e aggiunge funzionalità come la gestione delle fermate preferite tramite database SQLite.

## ✨ Caratteristiche

### Funzionalità Principali

- **Ricerca fermate** per località
- **Ricerca paline** per codice fermata, posizione GPS o percorso
- **Monitoraggio transiti** in tempo reale
- **Tracking veicoli** con posizioni GPS
- **Gestione preferiti** con persistenza su database SQLite
- **Trasformazione XML→JSON** automatica
- **API RESTful** con risposte JSON standardizzate
- **Documentazione OpenAPI** completa

### Funzionalità Aggiuntive

- Ricerca paline nel raggio GPS personalizzabile
- Ricerca percorsi tra località di partenza e destinazione
- Sistema di fermate preferite multi-utente
- Informazioni dettagliate sui veicoli in servizio
- Calcolo ritardi e tempi di attesa

## 🏗️ Architettura

```
cotral-server-api/
├── src/
│   ├── controllers/    # Controller per gestione richieste
│   ├── services/       # Logica di business e integrazione API Cotral
│   ├── routes/         # Definizione delle route Fastify
│   ├── interfaces/     # TypeScript interfaces
│   ├── utils/          # Funzioni di utilità
│   ├── database.ts     # Gestione connessione SQLite
│   └── app.ts         # Entry point dell'applicazione
├── database.sqlite     # Database SQLite (generato automaticamente)
├── OpenAPI.yaml       # Documentazione API Swagger/OpenAPI
├── package.json       # Dipendenze e script
└── README.md         # Questo file
```

### Stack Tecnologico

| Tecnologia | Utilizzo |
|------------|----------|
| **TypeScript** | Linguaggio principale per type safety |
| **Fastify** | Framework web ad alte prestazioni |
| **Axios** | Client HTTP per chiamate API esterne |
| **SQLite3** | Database embedded per dati persistenti |
| **XML2JS** | Parser XML to JSON |

## 📦 Prerequisiti

- **Node.js** >= 14.x
- **npm** >= 6.x o **yarn** >= 1.x
- **Git** per clonare il repository

## 🚀 Installazione

### 1. Clona il repository

```bash
git clone https://github.com/ChromuSx/cotral-server-api.git
cd cotral-server-api
```

### 2. Installa le dipendenze

```bash
npm install
# oppure
yarn install
```

### 3. Build del progetto (opzionale)

```bash
npm run build
```

### 4. Avvia il server

```bash
# Modalità sviluppo con hot-reload
npm run dev

# Modalità produzione
npm start
```

Il server sarà disponibile su `http://localhost:3000`

## ⚙️ Configurazione

### Variabili d'ambiente

Crea un file `.env` nella root del progetto (opzionale):

```env
# Server
PORT=3000
HOST=127.0.0.1

# Database
DB_PATH=./database.sqlite

# API Cotral (opzionale, usa i default se non specificato)
COTRAL_BASE_URL=http://travel.mob.cotralspa.it:7777/beApp
COTRAL_USER_ID=1BB73DCDAFA007572FC51E7407AB497C
```

## 📡 API Endpoints

### 🚏 Fermate (Stops)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/stops/{locality}` | Ottiene tutte le fermate di una località |
| GET | `/stops/firststop/{locality}` | Ottiene la prima fermata di una località |

### 📍 Paline (Poles)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/poles/{stopCode}` | Ottiene paline per codice fermata |
| GET | `/poles/position` | Ottiene paline vicine a coordinate GPS |
| GET | `/poles/{arrivalLocality}/{destinationLocality}` | Paline per percorso |
| GET | `/poles/destinations/{arrivalLocality}` | Destinazioni disponibili |
| GET | `/poles/favorites/{userId}` | Paline preferite dell'utente |
| POST | `/poles/favorites` | Aggiunge palina ai preferiti |
| DELETE | `/poles/favorites` | Rimuove palina dai preferiti |

### 🚌 Transiti (Transits)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/transits/{poleCode}` | Ottiene transiti per codice palina |

### 🚐 Veicoli (Vehicles)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | `/vehiclerealtimepositions/{vehicleCode}` | Posizione GPS in tempo reale |

## 💡 Esempi

### Ricerca fermate per località

```bash
curl -X GET "http://localhost:3000/stops/Roma"
```

**Risposta:**
```json
[
  {
    "codiceStop": "70101",
    "nomeStop": "ROMA - ANAGNINA",
    "localita": "ROMA",
    "coordX": 41.839722,
    "coordY": 12.601944
  }
]
```

### Ricerca paline vicine

```bash
curl -X GET "http://localhost:3000/poles/position?latitude=41.8397&longitude=12.6019&range=0.01"
```

### Monitoraggio transiti in tempo reale

```bash
curl -X GET "http://localhost:3000/transits/70101A"
```

**Risposta:**
```json
{
  "pole": {
    "codicePalina": "70101A",
    "nomePalina": "ANAGNINA - Capolinea",
    "localita": "ROMA",
    "coordX": 41.839722,
    "coordY": 12.601944
  },
  "transits": [
    {
      "idCorsa": "123456",
      "percorso": "ROMA - FRASCATI",
      "orarioPartenzaCorsa": "2024-01-15T14:30:00",
      "tempoTransito": "2024-01-15T14:35:00",
      "ritardo": "00:02:00",
      "automezzo": {
        "codice": "BUS001",
        "isAlive": true
      }
    }
  ]
}
```

### Aggiunta palina ai preferiti

```bash
curl -X POST "http://localhost:3000/poles/favorites" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "poleCode": "70101A",
    "stopCode": 70101
  }'
```

## 🧪 Testing

### Test API locali

```bash
# Test endpoint base
curl http://localhost:3000/

# Test con parametri query
curl "http://localhost:3000/poles/70101?userId=1"
```

### Test con Postman

Importa il file `OpenAPI.yaml` in Postman per avere una collezione completa di tutti gli endpoint con esempi di richieste e risposte.

### Test automatizzati

```bash
# Esegui i test (se configurati)
npm test
```

## 🚢 Deployment

### Deploy su Render

1. Fork questo repository
2. Crea un nuovo Web Service su [Render](https://render.com)
3. Connetti il tuo repository GitHub
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Deploy

### Deploy con Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build e run:
```bash
docker build -t cotral-api .
docker run -p 3000:3000 cotral-api
```

### Deploy su altre piattaforme

Il progetto è compatibile con:
- Heroku
- Railway
- Fly.io
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🤝 Contribuire

Contribuzioni, issues e feature requests sono benvenute.

1. Fork il progetto
2. Crea il tuo feature branch (`git checkout -b feature/NuovaFunzionalita`)
3. Commit delle modifiche (`git commit -m 'Aggiunta nuova funzionalità'`)
4. Push al branch (`git push origin feature/NuovaFunzionalita`)
5. Apri una Pull Request

### Linee guida per contribuire

- Mantieni il codice TypeScript type-safe
- Aggiungi test per nuove funzionalità
- Aggiorna la documentazione OpenAPI quando aggiungi nuovi endpoint
- Segui le convenzioni di naming esistenti
- Commenta il codice solo dove necessario per chiarire logiche complesse

## 💖 Supporta il Progetto

Questo progetto è completamente gratuito e open source. Se lo trovi utile e vuoi supportare il suo sviluppo continuo e gli aggiornamenti futuri, considera di fare una donazione. Il tuo supporto aiuta a mantenere vivo il progetto e mi motiva ad aggiungere nuove funzionalità e miglioramenti!

<div align="center">
  <a href="https://github.com/sponsors/ChromuSx"><img src="https://img.shields.io/badge/Sponsor-GitHub-EA4AAA?style=for-the-badge&logo=github-sponsors&logoColor=white" alt="GitHub Sponsors"></a>
  <a href="https://ko-fi.com/chromus"><img src="https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-fi"></a>
  <a href="https://buymeacoffee.com/chromus"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  <a href="https://www.paypal.com/paypalme/giovanniguarino1999"><img src="https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="PayPal"></a>
</div>

Ogni contributo, non importa quanto piccolo, è molto apprezzato! ❤️

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori informazioni.

## 👨‍💻 Autore

**Giovanni Guarino**  
📧 Email: giovanni.guarino1999@gmail.com  
🔗 GitHub: [@ChromuSx](https://github.com/ChromuSx)
