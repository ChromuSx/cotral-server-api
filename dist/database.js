"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
let db = null;
const getDb = () => {
    if (!db) {
        db = new sqlite3_1.default.Database('./database.sqlite', (err) => {
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
    return db;
};
exports.getDb = getDb;
