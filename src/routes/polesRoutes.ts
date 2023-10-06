import { FastifyInstance } from 'fastify';
import { PolesController } from '../controllers/polesController';

export const registerPolesRoutes = (fastify: FastifyInstance): void => {
    const polesController = new PolesController(fastify);
};