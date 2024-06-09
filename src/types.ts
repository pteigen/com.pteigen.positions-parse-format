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