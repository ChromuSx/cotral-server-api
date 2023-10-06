import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { TransitsService } from '../services/transitsService';

export class TransitsController {
    private transitsService: TransitsService;

    constructor(fastify: FastifyInstance) {
        this.transitsService = new TransitsService();

        fastify.get('/transits/:poleCode', this.getTransitsByPoleCode.bind(this));
    }

    private async getTransitsByPoleCode(request: any, reply: FastifyReply): Promise<void> {
        const poleCode = request.params.poleCode as string;

        if (!poleCode) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const transits = await this.transitsService.getTransitsByPoleCode(poleCode);
            reply.status(200).send(transits);
        } catch (error) {
            console.error('Error fetching transits by stop code:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
