import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { VehiclePosition } from '../interfaces/VehiclePosition';

export class VehiclesService {
    private baseURL: string;
    private userId: string;

    constructor() {
        this.baseURL = 'http://travel.mob.cotralspa.it:7777/beApp';
        this.userId = '1BB73DCDAFA007572FC51E7407AB497C';
    }

    public async getVehicleRealTimePositions(vehicleId: string): Promise<VehiclePosition[]> {
        try {
            const response = await axios.get(`${this.baseURL}/Automezzi.do`, {
                params: {
                    cmd: 'loc',
                    userId: this.userId,
                    pAutomezzo: vehicleId,
                    pFormato: 'xml'
                }
            });

            const parsedResponse = await parseStringPromise(response.data);
            const vehiclerealTimePositionsData = parsedResponse.listaPosizioni.posizione;

            if (!vehiclerealTimePositionsData) return [];

            return vehiclerealTimePositionsData.map((vehicleData: any) => {
                const coordX = vehicleData.$.pX.split(' ');
                const coordY = vehicleData.$.pY.split(' ');
                const time = vehicleData._;

                return {
                    coordX,
                    coordY,
                    time
                };
            });
        } catch (error) {
            console.error('Error fetching vehicles position:', error);
            return [];
        }
    }
}