# Cotral Server API

Cotral Server API è un progetto server-side scritto in TypeScript che funge da strato intermedio per interagire con le API di Cotral disponibili su [http://travel.mob.cotralspa.it:7777/beApp](http://travel.mob.cotralspa.it:7777/beApp). Questo layer aggiuntivo è progettato per facilitare l'acquisizione dei dati necessari, formattandoli in JSON e fornendo risposte più accessibili e personalizzate attraverso funzioni custom.

## Caratteristiche

- **Interfaccia API Cotral**: Interagisce direttamente con le API di Cotral, estraendo e riformattando i dati in un formato più facile da utilizzare.
- **Personalizzazione Risposte**: Modifica e personalizza le risposte delle API originali per renderle più intuitive e adatte alle esigenze degli sviluppatori.
- **Funzioni Custom**: Implementa funzioni custom che combinano più chiamate API per fornire dati aggregati e funzionalità avanzate.
- **Database SQLite**: Utilizza un semplice database SQLite per memorizzare le fermate preferite degli utenti, con colonne per `user_id`, `pole_code` e `stop_code`.

## Tecnologie e Librerie Utilizzate

- **TypeScript**: Linguaggio di programmazione principale per lo sviluppo dell'API.
- **Fastify**: Framework web veloce e low overhead per Node.js, utilizzato per costruire il server API.
- **Axios**: Libreria basata su promesse per il client HTTP, utilizzata per effettuare richieste a servizi web esterni.
- **SQLite**: Database leggero per la persistenza dei dati relativi alle fermate preferite.
- **XML2JS**: Libreria per trasformare file XML in oggetti JavaScript, utilizzata per l'elaborazione delle risposte XML dalle API di Cotral.

Queste librerie e framework sono stati scelti per la loro efficienza, facilità d'uso e comunità di supporto attiva, rendendo lo sviluppo e la manutenzione dell'API Cotral Server più gestibili.

## Documentazione API con OpenAPI
Per una documentazione dettagliata delle API, consulta il file OpenAPI.yaml incluso nel repository. Questo file contiene tutte le specifiche necessarie per comprendere e utilizzare le API Cotral Server.

## Installazione 

1. Clona il repository: 
   
	 `git clone https://github.com/ChromuSx/cotral-server-api.git`

3. Installa le dipendenze:
   
    `cd cotral-server-api npm install`

3. Avvia il server:
   
    `npm start`
