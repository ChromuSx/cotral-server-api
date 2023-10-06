"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const vehiclesService_1 = require("../services/vehiclesService");
class VehiclesController {
    constructor(fastify) {
        this.vehiclesService = new vehiclesService_1.VehiclesService();
        fastify.get('/vehiclerealtimepositions/:vehicleCode', this.getVehicleRealTimePositions.bind(this));
    }
    async getVehicleRealTimePositions(request, reply) {
        const vehicleCode = request.params.vehicleCode;
        if (!vehicleCode) {
            reply.status(400).send({ error: 'Invalid parameters' });
            return;
        }
        try {
            const vehicleRealTimePositions = await this.vehiclesService.getVehicleRealTimePositions(vehicleCode);
            reply.status(200).send(vehicleRealTimePositions);
        }
        catch (error) {
            console.error('Error fetching vehicles locations:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    }
}
exports.VehiclesController = VehiclesController;
