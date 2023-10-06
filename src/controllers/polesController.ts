import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PolesService } from '../services/polesService';
import { Pole } from '../interfaces/Pole';

export class PolesController {
    private polesService: PolesService;

    constructor(fastify: FastifyInstance) {
        this.polesService = new PolesService();

        fastify.get('/poles/:stopCode', this.getPolesByStopCode.bind(this));
        fastify.get('/poles/position', this.getPolesByPosition.bind(this));
        fastify.get('/poles/:arrivalLocality/:destinationLocality', this.getPoleByArrivalAndDestinationLocality.bind(this));
        fastify.get('/poles/destinations/:arrivalLocality', this.getAllPolesDestinationsByArrivalLocality.bind(this));
    }

    public async getPolesByStopCode(request: FastifyRequest<{ Params: { stopCode: string } }>, reply: FastifyReply): Promise<void> {
        const { stopCode } = request.params;

        if (!stopCode?.trim()) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const poles: Pole[] | null = await this.polesService.getPolesByStopCode(stopCode);
            reply.code(200).send(poles || []);
        } catch (error) {
            console.error(`Error searching poles by stop code "${stopCode}":`, error);
            reply.status(500).send({ error: 'Failed to retrieve poles' });
        }
    }

    public async getPolesByPosition(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const query = request.query as { latitude: string; longitude: string; range?: string };
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
        } catch (error) {
            console.error('Error getting poles by position:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }      

    public async getPoleByArrivalAndDestinationLocality(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { arrivalLocality, destinationLocality } = request.params as { arrivalLocality: string; destinationLocality: string };

        if (!arrivalLocality || !destinationLocality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const pole = await this.polesService.getPoleByArrivalAndDestinationLocality(arrivalLocality, destinationLocality);
            reply.status(200).send(pole);
        } catch (error) {
            console.error('Error getting pole by arrival and destination locality:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }

    public async getAllPolesDestinationsByArrivalLocality(
        request: FastifyRequest<{ Params: { arrivalLocality: string } }>,
        reply: FastifyReply
    ): Promise<void> {
        const { arrivalLocality } = request.params;

        if (!arrivalLocality?.trim()) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const destinations: string[] | null = await this.polesService.getAllPolesDestinationsByArrivalLocality(arrivalLocality);
            reply.code(200).send(destinations);
        } catch (error) {
            console.error(`Error getting all destinations by arrival locality "${arrivalLocality}":`, error);
            reply.status(500).send({ error: 'Failed to retrieve destinations' });
        }
    }
}
