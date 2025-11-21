export interface Sector {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    status: string; // "POWER" si tiene electricidad, otro valor si no
    lastUpdated: string;
    geojson: string; // String JSON que contiene el GeoJSON
}

export interface GeoJSONPolygon {
    type: "Polygon";
    coordinates: number[][][]; // [[[lon, lat], [lon, lat], ...]]
}

export interface CurrentSector {
    sectorId: number;
    sectorName: string;
}

export interface SectorUptimeHistory {
    sector: Sector;
    start: string;
    end: string;
    percentage: number;
    powerHours: number;
    totalHours: number;
    powerMinutes: number;
    totalMinutes: number;
    period?: string | null;
}

export interface SectorUptimeParams {
    start: string;
    end: string;
}

