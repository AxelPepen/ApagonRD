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

