import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { VehiclesService } from '../services/vehiclesService';

export class VehiclesController {
    private vehiclesService: VehiclesService;

    constructor(fastify: FastifyInstance) {
        this.vehiclesService = new VehiclesService();

        fastify.get('/vehiclerealtimepositions/:vehicleCode', this.getVehicleRealTimePositions.bind(this));
    }

    private async getVehicleRealTimePositions(request: any, reply: FastifyReply): Promise<void> {
        const vehicleCode = request.params.vehicleCode as string;

        if (!vehicleCode) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }

        try {
            const vehicleRealTimePositions = await this.vehiclesService.getVehicleRealTimePositions(vehicleCode);
            reply.status(200).send(vehicleRealTimePositions);
        } catch (error) {
            console.error('Error fetching vehicles locations:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}