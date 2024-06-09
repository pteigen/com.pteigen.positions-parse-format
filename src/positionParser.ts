import { Coordinates, ParseSingleResult, PositionFormat } from "./types";
import { toUtm } from "./utm";

export function parsePositionString(input: string): ParseSingleResult {
  return {
    isValid: false,
  };
}

export function toPositionString(
  coordinates: Coordinates,
  format: PositionFormat
): string {
  if (format === PositionFormat.UTM) {
    const utm = toUtm(coordinates);

    return `${utm.zoneNumber}${utm.zoneChar} ${utm.easting} ${utm.northing}`;
  }
  return "Not implemented!";
}
