import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Pole } from '../interfaces/Pole';
import { StopsService } from './stopsService';
import { getDb } from '../database';

export class PolesService {
    private baseURL: string;
    private userId: string;
    private stopsService: StopsService;
    

    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
        this.stopsService = new StopsService();
    }

    public async getPolesByStopCode(stopCode: string | number): Promise<Pole[] | null> {
        try {
            const response = await axios.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 5,
                    userId: this.userId,
                    pIdStop: stopCode,
                    pFormato: 'xml'
                }
            });

            const parsedResponse = await parseStringPromise(response.data);

            if (parsedResponse.paline && parsedResponse.paline.palina && parsedResponse.paline.palina.length > 0) {
                const polesData = parsedResponse.paline.palina;

                return polesData.map((poleData: any) => ({
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
        } catch (error) {
            console.error('Error searching poles:', error);
            return [];
        }

        return null;
    }

    public async getPolesByPosition(latitude: number, longitude: number, range: number = 0.005): Promise<Pole[] | null> {
        try {
            const pX1 = latitude - range;
            const pY1 = longitude - range;
            const pX2 = latitude + range;
            const pY2 = longitude + range;

            const response = await axios.get(`${this.baseURL}/PIV.do`, {
                params: {
                    cmd: 7,
                    pX1: pX1,
                    pY1: pY1,
                    pX2: pX2,
                    pY2: pY2,
                    pZ: 90
                }
            });

            const parsedResponse = await parseStringPromise(response.data);

            if (parsedResponse.paline && parsedResponse.paline.palina && parsedResponse.paline.palina.length > 0) {
                const polesData = parsedResponse.paline.palina;

                return polesData.map((poleData: any) => ({
                    codicePalina: poleData.codicePalina[0],
                    nomePalina: poleData.nomePalina[0],
                    coordX: parseFloat(poleData.coordX[0]),
                    coordY: parseFloat(poleData.coordY[0]),
                    tipo: poleData.tipo[0],
                    isCotral: poleData.isCotral[0] ? Number(poleData.isCotral[0]) : null,
                    isBanchinato: poleData.isBanchinato[0] ? Number(poleData.isBanchinato[0]) : null
                }));
            }
        } catch (error) {
            console.error('Error getting poles by coordinates:', error);
            return null;
        }

        return null;
    }

    public async getPolesByArrivalAndDestinationLocality(arrivalLocality: string, destinationLocality: string): Promise<Pole[]> {
        try {
            const stops = await this.stopsService.getStopsByLocality(arrivalLocality);
            let result: Pole[] = [];
    
            if (stops?.length > 0) {
                for (const stop of stops) {
                    if (stop.codiceStop) {
                        const poles = await this.getPolesByStopCode(stop.codiceStop);
                        if (poles !== null) {
                            const filteredPoles = poles.filter((pole: Pole) => {
                                return (
                                    pole.destinazioni &&
                                    pole.destinazioni.some(destinazione => destinazione.toLowerCase().includes(destinationLocality.toLowerCase()))
                                );
                            });
                            result = result.concat(filteredPoles);
                        }
                    }
                }
            }
            return result;
        } catch (error) {
            console.error('Error filtering poles by destination:', error);
            return [];
        }
    }    

    public async getAllPolesDestinationsByArrivalLocality(arrivalLocality: string): Promise<string[] | null> {
        try {
            const firstStop = await this.stopsService.getFirstStopByLocality(arrivalLocality);

            if (firstStop !== null) {
                const poles = await this.getPolesByStopCode(firstStop.codiceStop);

                if (poles !== null) {
                    const allDestinations: string[] = [];

                    poles.forEach((pole: Pole) => {
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
        } catch (error) {
            console.error('Error getting all destinations by arrival locality:', error);
        }

        return null;
    }


    public checkIfPoleIsFavorite(userId: number, poleCode: string): Promise<boolean> {
        const db = getDb();
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) as count FROM favorite_poles WHERE user_id = ? AND pole_code = ?';
            db.get(sql, [userId, poleCode], (err, row: { count: number }) => {
                if (err) {
                    return reject(err);
                }
                const isFavorite = row && row.count > 0;
                resolve(isFavorite);
            });
        });
    }

    public async getFavoritePoles(userId: number): Promise<Pole[] | null> {
        const db = getDb();
        return new Promise(async (resolve, reject) => {
            const sql = 'SELECT pole_code, stop_code FROM favorite_poles WHERE user_id = ?';
            db.all(sql, [userId], async (err, rows: any) => {
                if (err) {
                    console.log('err', err);
                    return reject(err);
                }
    
                if (!rows || rows.length === 0) {
                    return resolve([]);
                }

                const favoritePoleCodes: string[] = rows.map((row: any) => row.pole_code);
                const favoriteStopCodes: number[] = rows.map((row: any) => row.stop_code);
                const uniqueFavoriteStopCodes: number[] = [...new Set(favoriteStopCodes)];

                const favoritePoles: Pole[] = [];
    
                for (const favoriteStopCode of uniqueFavoriteStopCodes) {
                    console.log('favoriteStopCode', favoriteStopCode);
                    const polesByStopCode = await this.getPolesByStopCode(favoriteStopCode);
                    if (polesByStopCode) {
                        const matchingPoles = polesByStopCode.filter(poleByStopCode => {
                            if (poleByStopCode.codicePalina !== undefined) {
                                return favoritePoleCodes.includes(poleByStopCode.codicePalina);
                            }
                            return false;
                        });
                        matchingPoles.forEach(pole => {
                            pole.preferita = true;
                            pole.codiceStop = favoriteStopCode;
                        });
                        favoritePoles.push(...matchingPoles);
                    }
                }
    
                resolve(favoritePoles);
            });
        });
    }    

    public addFavoritePole(userId: number, poleCode: string, stopCode: number): Promise<void> {
        const db = getDb();
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO favorite_poles(user_id, pole_code, stop_code) VALUES(?, ?, ?)';
            db.run(sql, [userId, poleCode, stopCode], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public removeFavoritePole(userId: number, poleCode: string): Promise<void> {
        const db = getDb();
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM favorite_poles WHERE user_id = ? AND pole_code = ?';
            db.run(sql, [userId, poleCode], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}