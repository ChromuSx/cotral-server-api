"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopsService = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
class StopsService {
    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
    }
    async getFirstStopByLocality(locality) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 6,
                    userId: this.userId,
                    pStringa: locality.toLowerCase()
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            if (parsedResponse.listaStop && parsedResponse.listaStop.stop && parsedResponse.listaStop.stop.length > 0) {
                const stopData = parsedResponse.listaStop.stop[0];
                return {
                    codiceStop: stopData.codiceStop[0],
                    nomeStop: stopData.nomeStop[0],
                    localita: stopData.localita[0],
                    coordX: parseFloat(stopData.coordX[0]),
                    coordY: parseFloat(stopData.coordY[0])
                };
            }
        }
        catch (error) {
            console.error('Error fetching stop by ID:', error);
        }
        return null;
    }
    async getStopsByLocality(locality) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 6,
                    userId: this.userId,
                    pStringa: locality,
                    pFormato: 'xml'
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            if (parsedResponse.listaStop && parsedResponse.listaStop.stop && parsedResponse.listaStop.stop.length > 0) {
                const stopsData = parsedResponse.listaStop.stop;
                return stopsData.map((stopData) => ({
                    codiceStop: stopData.codiceStop[0],
                    nomeStop: stopData.nomeStop[0],
                    localita: stopData.localita[0],
                    coordX: parseFloat(stopData.coordX[0]),
                    coordY: parseFloat(stopData.coordY[0])
                }));
            }
        }
        catch (error) {
            console.error('Error searching stops:', error);
            return [];
        }
        return [];
    }
}
exports.StopsService = StopsService;
