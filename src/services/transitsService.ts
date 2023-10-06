import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { convertToReadableTime } from '../utils/globalFunctions';
import { Pole } from '../interfaces/Pole';
import { Transit } from '../interfaces/Transit';
import { Vehicle } from '../interfaces/Vehicle';

export class TransitsService {
    private baseURL: string;
    private userId: string;
    private delta: string;

    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
        this.delta = '261';
    }

    public async getTransitsByPoleCode(poleCode: string): Promise<{ pole: Pole; transits: Transit[] }> {
        try {
            const response = await axios.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 1,
                    userId: this.userId,
                    pCodice: poleCode,
                    pFormato: 'xml',
                    pDelta: this.delta
                }
            });

            const parsedResponse = await parseStringPromise(response.data);

            const poleData = parsedResponse.transiti.palina[0];
            const pole: Pole = {
                codicePalina: poleData.codice[0],
                nomePalina: poleData.nomePalina[0],
                localita: poleData.localita[0],
                coordX: poleData.latitudine[0],
                coordY: poleData.longitudine[0],
                comune: poleData.comune[0],
                nomeStop: poleData.nomeStop[0],
                preferita: poleData.preferita[0] === '1'
            };

            const transitsData = parsedResponse.transiti.corsa;

            return {
                pole,
                transits: transitsData.map((transitData: any) => {
                    const automezzo: Vehicle = {
                        codice: transitData.automezzo[0]._ ? transitData.automezzo[0]._ : null,
                        isAlive: transitData.automezzo[0].$.isAlive === '1'
                    };

                    return {
                        idCorsa: transitData.idCorsa[0],
                        percorso: transitData.percorso[0],
                        partenzaCorsa: transitData.partenzaCorsa[0],
                        orarioPartenzaCorsa: convertToReadableTime(transitData.orarioPartenzaCorsa[0]),
                        arrivoCorsa: transitData.arrivoCorsa[0],
                        orarioArrivoCorsa: convertToReadableTime(transitData.orarioArrivoCorsa[0]),
                        soppressa: transitData.soppressa[0],
                        numeroOrdine: transitData.numeroOrdine[0],
                        tempoTransito: convertToReadableTime(transitData.tempoTransito[0]),
                        ritardo: convertToReadableTime(transitData.ritardo[0]),
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
        } catch (error) {
            console.error('Error fetching transits by pole code:', error);
            return { pole: {} as Pole, transits: [] };
        }
    }
}