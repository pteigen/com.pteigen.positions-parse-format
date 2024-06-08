import { Coordinates } from "./types";

const utmZonesNorth : string = "NPQRSTUVWX";
const utmZonesSouth : string = "MLKJHGFEDC";

export function utmZone(coordinates: Coordinates) : string {
    const utmCharIndex = Math.floor(Math.abs(coordinates.lat) / 8);
    const utmChar = coordinates.lat >= 0 ? utmZonesNorth.charAt(utmCharIndex) : utmZonesSouth.charAt(utmCharIndex);

    let zoneOffset = Math.floor(((coordinates.lon % 180) + 180) / 6) + 1;
    if (utmChar === "V" && zoneOffset === 31 && coordinates.lon >= 3) {
        zoneOffset += 1;
    }

    if (utmChar === "X" && zoneOffset === 32) {
        zoneOffset += (coordinates.lon >= 9) ? 1 : -1;
    }

    if (utmChar === "X" && zoneOffset === 34) {
        zoneOffset += (coordinates.lon >= 21) ? 1 : -1;
    }

    if (utmChar === "X" && zoneOffset === 36) {
        zoneOffset += (coordinates.lon >= 33) ? 1 : -1;
    }

    return zoneOffset + utmChar;
}