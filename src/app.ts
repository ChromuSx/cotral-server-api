import fastify, { FastifyInstance } from 'fastify';
import { registerStopsRoutes } from './routes/stopsRoutes';
import { registerPolesRoutes } from './routes/polesRoutes';
import { registerTransitsRoutes } from './routes/transitsRoutes';
import { registerVehiclesRoutes } from './routes/vehiclesRoutes';

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
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    try {
        await app.listen({ port: port});
        app.log.info(`Server listening on port ${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();