"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopsController = void 0;
const stopsService_1 = require("../services/stopsService");
class StopsController {
    constructor(fastify) {
        this.stopsService = new stopsService_1.StopsService();
        fastify.get('/stops/firststop/:locality', this.getFirstStopByLocality.bind(this));
        fastify.get('/stops/:locality', this.getStopsByLocality.bind(this));
    }
    async getStopsByLocality(request, reply) {
        const locality = request.params.locality;
        if (!locality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const stops = await this.stopsService.getStopsByLocality(locality);
            reply.status(200).send(stops);
        }
        catch (error) {
            console.error('Error searching stops:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
    async getFirstStopByLocality(request, reply) {
        const locality = request.params.locality;
        if (!locality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const stop = await this.stopsService.getFirstStopByLocality(locality);
            reply.status(200).send(stop);
        }
        catch (error) {
            console.error('Error fetching stop by id:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
exports.StopsController = StopsController;
