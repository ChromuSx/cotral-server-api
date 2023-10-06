"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolesService = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const stopsService_1 = require("./stopsService");
class PolesService {
    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
        this.stopsService = new stopsService_1.StopsService();
    }
    async getPolesByStopCode(stopCode) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 5,
                    userId: this.userId,
                    pIdStop: stopCode,
                    pFormato: 'xml'
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            if (parsedResponse.paline && parsedResponse.paline.palina && parsedResponse.paline.palina.length > 0) {
                const polesData = parsedResponse.paline.palina;
                return polesData.map((poleData) => ({
                    codicePalina: poleData.codicePalina[0],
                    nomePalina: poleData.nomePalina[0],
                    nomeStop: poleData.nomeStop[0],
                    localita: poleData.localita[0],
                    coordX: parseFloat(poleData.coordX[0]),
                    coordY: parseFloat(poleData.coordY[0]),
                    zonaTariffaria: poleData.zonaTariffaria[0],
                    distanza: poleData.distanza[0],
                    destinazioni: poleData.destinazioni[0].destinazione,
                    isCotral: poleData.isCotral[0] ? Number(poleData.isCotral[0]) : null,
                    isCapolinea: poleData.isCapolinea[0] ? Number(poleData.isCapolinea[0]) : null,
                    isBanchinato: poleData.isBanchinato[0] ? Number(poleData.isBanchinato[0]) : null
                }));
            }
        }
        catch (error) {
            console.error('Error searching poles:', error);
            return [];
        }
        return null;
    }
    async getPolesByPosition(latitude, longitude, range = 0.005) {
        try {
            const pX1 = latitude - range;
            const pY1 = longitude - range;
            const pX2 = latitude + range;
            const pY2 = longitude + range;
            const response = await axios_1.default.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 7,
                    pX1: pX1,
                    pY1: pY1,
                    pX2: pX2,
                    pY2: pY2,
                    pZ: 90
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            if (parsedResponse.paline && parsedResponse.paline.palina && parsedResponse.paline.palina.length > 0) {
                const polesData = parsedResponse.paline.palina;
                return polesData.map((poleData) => ({
                    codicePalina: poleData.codicePalina[0],
                    nomePalina: poleData.nomePalina[0],
                    coordX: parseFloat(poleData.coordX[0]),
                    coordY: parseFloat(poleData.coordY[0]),
                    tipo: poleData.tipo[0],
                    isCotral: poleData.isCotral[0] ? Number(poleData.isCotral[0]) : null,
                    isBanchinato: poleData.isBanchinato[0] ? Number(poleData.isBanchinato[0]) : null
                }));
            }
        }
        catch (error) {
            console.error('Error getting poles by coordinates:', error);
            return null;
        }
        return null;
    }
    async getPoleByArrivalAndDestinationLocality(arrivalLocality, destinationLocality) {
        try {
            const firstStop = await this.stopsService.getFirstStopByLocality(arrivalLocality);
            if (firstStop !== null) {
                const poles = await this.getPolesByStopCode(firstStop.codiceStop);
                if (poles !== null) {
                    const filteredPoles = poles.filter((pole) => {
                        return (pole.destinazioni &&
                            pole.destinazioni.some(destinazione => destinazione.toLowerCase().includes(destinationLocality.toLowerCase())));
                    });
                    if (filteredPoles.length > 0) {
                        return filteredPoles[0];
                    }
                }
            }
        }
        catch (error) {
            console.error('Error filtering poles by destination:', error);
        }
        return null;
    }
    async getAllPolesDestinationsByArrivalLocality(arrivalLocality) {
        try {
            const firstStop = await this.stopsService.getFirstStopByLocality(arrivalLocality);
            if (firstStop !== null) {
                const poles = await this.getPolesByStopCode(firstStop.codiceStop);
                if (poles !== null) {
                    const allDestinations = [];
                    poles.forEach((pole) => {
                        if (pole.destinazioni) {
                            pole.destinazioni.forEach(destination => {
                                if (!allDestinations.includes(destination)) {
                                    allDestinations.push(destination);
                                }
                            });
                        }
                    });
                    return allDestinations;
                }
            }
        }
        catch (error) {
            console.error('Error getting all destinations by arrival locality:', error);
        }
        return null;
    }
}
exports.PolesService = PolesService;
