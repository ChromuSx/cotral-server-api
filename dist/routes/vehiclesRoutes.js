"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVehiclesRoutes = void 0;
const vehiclesController_1 = require("../controllers/vehiclesController");
const registerVehiclesRoutes = (fastify) => {
    const vehiclesController = new vehiclesController_1.VehiclesController(fastify);
};
exports.registerVehiclesRoutes = registerVehiclesRoutes;
