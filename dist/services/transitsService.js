"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitsService = void 0;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const globalFunctions_1 = require("../utils/globalFunctions");
class TransitsService {
    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
        this.delta = '261';
    }
    async getTransitsByPoleCode(poleCode) {
        try {
            const response = await axios_1.default.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 1,
                    userId: this.userId,
                    pCodice: poleCode,
                    pFormato: 'xml',
                    pDelta: this.delta
                }
            });
            const parsedResponse = await (0, xml2js_1.parseStringPromise)(response.data);
            const poleData = parsedResponse.transiti?.palina?.[0];
            const transitsData = parsedResponse.transiti?.corsa;
            if (!poleData || !transitsData) {
                return null;
            }
            const pole = {
                codicePalina: poleData.codice[0],
                nomePalina: poleData.nomePalina[0],
                localita: poleData.localita[0],
                coordX: poleData.latitudine[0],
                coordY: poleData.longitudine[0],
                comune: poleData.comune[0],
                nomeStop: poleData.nomeStop[0],
                preferita: poleData.preferita[0] === '1'
            };
            return {
                pole,
                transits: transitsData.map((transitData) => {
                    const automezzo = {
                        codice: transitData?.automezzo?.[0]?._ ? transitData.automezzo?.[0]?._ : null,
                        isAlive: transitData?.automezzo?.[0].$?.isAlive === '1'
                    };
                    return {
                        idCorsa: transitData.idCorsa[0],
                        percorso: transitData.percorso[0],
                        partenzaCorsa: transitData.partenzaCorsa[0],
                        orarioPartenzaCorsa: (0, globalFunctions_1.convertToReadableTime)(transitData.orarioPartenzaCorsa[0]),
                        arrivoCorsa: transitData.arrivoCorsa[0],
                        orarioArrivoCorsa: (0, globalFunctions_1.convertToReadableTime)(transitData.orarioArrivoCorsa[0]),
                        soppressa: transitData.soppressa[0],
                        numeroOrdine: transitData.numeroOrdine[0],
                        tempoTransito: (0, globalFunctions_1.convertToReadableTime)(transitData.tempoTransito[0]),
                        ritardo: (0, globalFunctions_1.convertToReadableTime)(transitData.ritardo[0]),
                        passato: transitData.passato[0],
                        automezzo,
                        testoFermata: transitData.testoFermata[0],
                        dataModifica: transitData.dataModifica[0],
                        instradamento: transitData.instradamento[0],
                        banchina: transitData.banchina[0],
                        monitorata: transitData.monitorata[0],
                        accessibile: transitData.accessibile[0]
                    };
                })
            };
        }
        catch (error) {
            console.error('Error fetching transits by pole code:', error);
            return { pole: {}, transits: [] };
        }
    }
}
exports.TransitsService = TransitsService;
