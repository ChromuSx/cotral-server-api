import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { PolesService } from '../services/polesService';
import { Pole } from '../interfaces/Pole';

export class PolesController {
    private polesService: PolesService;

    constructor(fastify: FastifyInstance) {
        this.polesService = new PolesService();

        fastify.get('/poles/:stopCode', this.getPolesByStopCode.bind(this));
        fastify.get('/poles/position', this.getPolesByPosition.bind(this));
        fastify.get('/poles/:arrivalLocality/:destinationLocality', this.getPolesByArrivalAndDestinationLocality.bind(this));
        fastify.get('/poles/destinations/:arrivalLocality', this.getAllPolesDestinationsByArrivalLocality.bind(this));
        fastify.post('/poles/favorites', this.addFavoritePole.bind(this));
        fastify.delete('/poles/favorites', this.removeFavoritePole.bind(this));
        fastify.get('/poles/favorites/:userId', this.getFavoritePoles.bind(this));
    }

    public async getPolesByStopCode(request: FastifyRequest<{ Params: { stopCode: number; } }>, reply: FastifyReply): Promise<void> {
        const { stopCode } = request.params;
        const query = request.query as { userId?: number; };
        const userId = query.userId ? parseInt(query.userId.toString(), 10) : undefined;
        try {
            const poles: Pole[] | null = await this.polesService.getPolesByStopCode(stopCode);
    
            if (poles && poles.length > 0) {
                const updatedPoles = await Promise.all(poles.map(async pole => {
                    pole.preferita = userId && pole.codicePalina ? await this.polesService.checkIfPoleIsFavorite(userId, pole.codicePalina) : false;
                    pole.codiceStop = stopCode;
                    return pole;
                }));
                reply.code(200).send(updatedPoles);
            } else {
                reply.code(200).send(poles || []);
            }
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

    public async getPolesByArrivalAndDestinationLocality(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const { arrivalLocality, destinationLocality } = request.params as { arrivalLocality: string; destinationLocality: string };

        if (!arrivalLocality || !destinationLocality) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const poles = await this.polesService.getPolesByArrivalAndDestinationLocality(arrivalLocality, destinationLocality);
            reply.status(200).send(poles);
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

    public async getFavoritePoles(request: FastifyRequest<{ Params: { userId: number } }>, reply: FastifyReply): Promise<void> {
        const { userId } = request.params;
        if (!userId) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const favoritePoles: Pole[] | null = await this.polesService.getFavoritePoles(userId);
            reply.code(200).send(favoritePoles || []);
        } catch (error) {
            console.error(`Error getting favorite poles for user "${userId}":`, error);
            reply.status(500).send({ error: 'Failed to retrieve favorite poles' });
        }
    }    

    public async addFavoritePole(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = request.body as { userId: number; poleCode: string, stopCode: number };

        try {
            await this.polesService.addFavoritePole(body.userId, body.poleCode, body.stopCode);
            reply.code(201).send({ message: 'Pole added to favorites' });
        } catch (error) {
            console.error('Error adding favorite pole:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }

    public async removeFavoritePole(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = request.body as { userId: number; poleCode: string };

        try {
            await this.polesService.removeFavoritePole(body.userId, body.poleCode);
            reply.code(200).send({ message: 'Pole removed from favorites' });
        } catch (error) {
            console.error('Error removing favorite pole:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
