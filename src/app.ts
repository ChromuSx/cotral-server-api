import fastify, { FastifyInstance } from 'fastify';
import { registerStopsRoutes } from './routes/stopsRoutes';
import { registerPolesRoutes } from './routes/polesRoutes';
import { registerTransitsRoutes } from './routes/transitsRoutes';
import { registerVehiclesRoutes } from './routes/vehiclesRoutes';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
  });
  
  db.run(`
    CREATE TABLE IF NOT EXISTS favorite_poles (
      user_id INTEGER,
      pole_code STRING,
      stop_code INTEGER,
      PRIMARY KEY (user_id, pole_code, stop_code)
    )
  `);

const createApp = async (): Promise<FastifyInstance> => {
    const app = await fastify({ logger: true });

    // Register routes
    registerStopsRoutes(app);
    registerPolesRoutes(app);
    registerTransitsRoutes(app);
    registerVehiclesRoutes(app);

    return app;
};

const start = async (): Promise<void> => {
    const app = await createApp();
    const host = process.env.PORT ? process.env.HOST : '127.0.0.1';
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    try {
        await app.listen({ host: host, port: port});
        app.log.info(`Server listening on port ${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();