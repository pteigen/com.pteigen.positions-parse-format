export interface Coordinates {
    lon: number;
    lat: number;
}

export type ParseSingleResult = {
    isValid: true,
    coordinates: Coordinates
} | {
    isValid: false
}

export enum PositionFormat {
    UTM,
    MGRS
}

export interface Utm {
    zoneChar: string;
    zoneNumber: number;
    easting: number;
    northing: number;
}

export type Mgrs = Utm & {
    designator: string;
};