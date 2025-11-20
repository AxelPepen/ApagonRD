import {User} from "../user/user.ts";
import {Sector} from "../sector/Sector.ts";

export interface CreateReport {
    latitude: number;
    longitude: number;
    sectorId: number;
    outageType: string;
    description: string;
    status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
    photoUrl?: string;
}

export interface Report {
    id: number;
    createdAt: string;
    updatedAt: string;
    latitude: number;
    longitude: number;
    sectorId: number;
    outageType: string;
    description: string;
    status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
    photoUrl?: string;
    user?: User;
    sector?: Sector;
}



