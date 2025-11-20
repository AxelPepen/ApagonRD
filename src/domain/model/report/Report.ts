import {User} from "../user/user.ts";
import {Sector} from "../sector/Sector.ts";

export type PowerStatus = "POWER" | "NO_POWER";

export interface CreateReport {
    latitude: number;
    longitude: number;
    sectorId: number;
    powerStatus: PowerStatus;
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
    powerStatus: PowerStatus;
    description: string;
    status: "RECEIVED" | "IN_PROGRESS" | "RESOLVED";
    photoUrl?: string;
    user?: User;
    sector?: Sector;
}



