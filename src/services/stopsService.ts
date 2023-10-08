import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Stop } from '../interfaces/Stop';

export class StopsService {
    private baseURL: string;
    private userId: string;

    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
    }

    public async getFirstStopByLocality(locality: string): Promise<Stop | null> {
        try {
            const response = await axios.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 6,
                    userId: this.userId,
                    pStringa: locality.toLowerCase()
                }
            });

            const parsedResponse = await parseStringPromise(response.data);

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
        } catch (error) {
            console.error('Error fetching stop by ID:', error);
        }

        return null;
    }

    public async getStopsByLocality(locality: string): Promise<Stop[]> {
        try {
            const response = await axios.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 6,
                    userId: this.userId,
                    pStringa: locality,
                    pFormato: 'xml'
                }
            });

            const parsedResponse = await parseStringPromise(response.data);
            if (parsedResponse.listaStop && parsedResponse.listaStop.stop && parsedResponse.listaStop.stop.length > 0) {
                const stopsData = parsedResponse.listaStop.stop;

                return stopsData.map((stopData: any) => ({
                    codiceStop: stopData.codiceStop[0],
                    nomeStop: stopData.nomeStop[0],
                    localita: stopData.localita[0],
                    coordX: parseFloat(stopData.coordX[0]),
                    coordY: parseFloat(stopData.coordY[0])
                }));
            }
        } catch (error) {
            console.error('Error searching stops:', error);
            return [];
        }

        return [];
    }
}