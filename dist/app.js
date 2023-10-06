"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const stopsRoutes_1 = require("./routes/stopsRoutes");
const polesRoutes_1 = require("./routes/polesRoutes");
const transitsRoutes_1 = require("./routes/transitsRoutes");
const vehiclesRoutes_1 = require("./routes/vehiclesRoutes");
const createApp = async () => {
    const app = await (0, fastify_1.default)({ logger: true });
    // Register routes
    (0, stopsRoutes_1.registerStopsRoutes)(app);
    (0, polesRoutes_1.registerPolesRoutes)(app);
    (0, transitsRoutes_1.registerTransitsRoutes)(app);
    (0, vehiclesRoutes_1.registerVehiclesRoutes)(app);
    return app;
};
const start = async () => {
    const app = await createApp();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    try {
        await app.listen({ port: port });
        app.log.info(`Server listening on port ${port}`);
    }
    catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};
start();
