"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
class VehiclesService {
    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
    }
    async getVehicleRealTimePositions(vehicleId) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/Automezzi.do`, {
                params: {
                    cmd: 'loc',
                    userId: this.userId,
                    pAutomezzo: vehicleId,
                    pFormato: 'xml'
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            const vehiclerealTimePositionsData = parsedResponse.listaPosizioni.posizione;
            return vehiclerealTimePositionsData.map((vehicleData) => {
                const coordX = vehicleData.$.pX.split(' ');
                const coordY = vehicleData.$.pY.split(' ');
                const time = vehicleData._;
                return {
                    coordX,
                    coordY,
                    time
                };
            });
        }
        catch (error) {
            console.error('Error fetching vehicles position:', error);
            return [];
        }
    }
}
exports.VehiclesService = VehiclesService;
