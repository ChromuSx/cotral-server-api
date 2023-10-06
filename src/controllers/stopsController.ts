import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { StopsService } from '../services/stopsService';

export class StopsController {
    private stopsService: StopsService;

    constructor(fastify: FastifyInstance) {
        this.stopsService = new StopsService();

        fastify.get('/stops/firststop/:locality', this.getFirstStopByLocality.bind(this));
        fastify.get('/stops/:locality', this.getStopsByLocality.bind(this));
    }

    public async getStopsByLocality(request: any, reply: FastifyReply): Promise<void> {
        const locality = request.params.locality as string;

        if (!locality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const stops = await this.stopsService.getStopsByLocality(locality);
            reply.status(200).send(stops);
        } catch (error) {
            console.error('Error searching stops:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }

    private async getFirstStopByLocality(request: any, reply: FastifyReply): Promise<void> {
        const locality = request.params.locality as string;

        if (!locality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const stop = await this.stopsService.getFirstStopByLocality(locality);
            reply.status(200).send(stop);
        } catch (error) {
            console.error('Error fetching stop by id:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}