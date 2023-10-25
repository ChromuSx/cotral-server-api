import sqlite3 from 'sqlite3';

let db: sqlite3.Database | null = null;

export const getDb = (): sqlite3.Database => {
  if (!db) {
    db = new sqlite3.Database('./database.sqlite', (err) => {
      if (err) {
        console.error("Errore nell'apertura del database", err);
      }
    });
    
    process.on('exit', () => {
      if (db) {
        db.close((err) => {
          if (err) {
            console.error(err.message);
          }
          console.log('Chiusura del database.');
        });
      }
    });
  }
  return db!;
};
