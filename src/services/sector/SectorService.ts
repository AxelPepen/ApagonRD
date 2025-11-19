import {BaseService} from "../BaseService.ts";
import {Sector} from "../../domain/model/sector/Sector.ts";

export class SectorService extends BaseService {
    private static factory: SectorService = new SectorService();

    static get instance(): SectorService {
        return SectorService.factory;
    }

    constructor() {
        super('sectors');
    }

    async getAllSectors(): Promise<Sector[]> {
        return this.get<Sector[]>('');
    }

    async getCurrentSector(lat: number, lon: number): Promise<Sector> {
        return this.get<Sector>('/current', { lat, lon });
    }
}

