"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolesController = void 0;
const polesService_1 = require("../services/polesService");
class PolesController {
    constructor(fastify) {
        this.polesService = new polesService_1.PolesService();
        fastify.get('/poles/:stopCode', this.getPolesByStopCode.bind(this));
        fastify.get('/poles/position', this.getPolesByPosition.bind(this));
        fastify.get('/poles/:arrivalLocality/:destinationLocality', this.getPolesByArrivalAndDestinationLocality.bind(this));
        fastify.get('/poles/destinations/:arrivalLocality', this.getAllPolesDestinationsByArrivalLocality.bind(this));
    }
    async getPolesByStopCode(request, reply) {
        const { stopCode } = request.params;
        if (!stopCode?.trim()) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const poles = await this.polesService.getPolesByStopCode(stopCode);
            reply.code(200).send(poles || []);
        }
        catch (error) {
            console.error(`Error searching poles by stop code "${stopCode}":`, error);
            reply.status(500).send({ error: 'Failed to retrieve poles' });
        }
    }
    async getPolesByPosition(request, reply) {
        const query = request.query;
        const latitude = parseFloat(query.latitude);
        const longitude = parseFloat(query.longitude);
        const range = query.range ? parseFloat(query.range) : undefined;
        if (isNaN(latitude) || isNaN(longitude)) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const poles = await this.polesService.getPolesByPosition(latitude, longitude, range);
            reply.status(200).send(poles || []);
        }
        catch (error) {
            console.error('Error getting poles by position:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
    async getPolesByArrivalAndDestinationLocality(request, reply) {
        const { arrivalLocality, destinationLocality } = request.params;
        if (!arrivalLocality || !destinationLocality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const poles = await this.polesService.getPolesByArrivalAndDestinationLocality(arrivalLocality, destinationLocality);
            reply.status(200).send(poles);
        }
        catch (error) {
            console.error('Error getting pole by arrival and destination locality:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
    async getAllPolesDestinationsByArrivalLocality(request, reply) {
        const { arrivalLocality } = request.params;
        if (!arrivalLocality?.trim()) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const destinations = await this.polesService.getAllPolesDestinationsByArrivalLocality(arrivalLocality);
            reply.code(200).send(destinations);
        }
        catch (error) {
            console.error(`Error getting all destinations by arrival locality "${arrivalLocality}":`, error);
            reply.status(500).send({ error: 'Failed to retrieve destinations' });
        }
    }
}
exports.PolesController = PolesController;
