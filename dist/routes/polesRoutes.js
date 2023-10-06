"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPolesRoutes = void 0;
const polesController_1 = require("../controllers/polesController");
const registerPolesRoutes = (fastify) => {
    const polesController = new polesController_1.PolesController(fastify);
};
exports.registerPolesRoutes = registerPolesRoutes;
