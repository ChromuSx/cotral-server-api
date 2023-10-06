import { FastifyInstance } from 'fastify';
import { VehiclesController } from '../controllers/vehiclesController';

export const registerVehiclesRoutes = (fastify: FastifyInstance): void => {
    const vehiclesController = new VehiclesController(fastify);
};