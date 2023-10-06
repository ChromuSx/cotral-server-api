"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStopsRoutes = void 0;
const stopsController_1 = require("../controllers/stopsController");
const registerStopsRoutes = (fastify) => {
    const stopsController = new stopsController_1.StopsController(fastify);
};
exports.registerStopsRoutes = registerStopsRoutes;
