"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitsController = void 0;
const transitsService_1 = require("../services/transitsService");
class TransitsController {
    constructor(fastify) {
        this.transitsService = new transitsService_1.TransitsService();
        fastify.get('/transits/:poleCode', this.getTransitsByPoleCode.bind(this));
    }
    async getTransitsByPoleCode(request, reply) {
        const poleCode = request.params.poleCode;
        if (!poleCode) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const transits = await this.transitsService.getTransitsByPoleCode(poleCode);
            reply.status(200).send(transits);
        }
        catch (error) {
            console.error('Error fetching transits by stop code:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
exports.TransitsController = TransitsController;
