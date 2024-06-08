import {Coordinates, ParseSingleResult, PositionFormat} from "./types";

export function parsePositionString(input: string) : ParseSingleResult {
    return {
        isValid: false
    }
}

export function toPositionString(coordinates: Coordinates, format: PositionFormat) : string {
    
}