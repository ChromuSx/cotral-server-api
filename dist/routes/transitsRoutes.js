"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTransitsRoutes = void 0;
const transitsController_1 = require("../controllers/transitsController");
const registerTransitsRoutes = (fastify) => {
    const transitsController = new transitsController_1.TransitsController(fastify);
};
exports.registerTransitsRoutes = registerTransitsRoutes;
