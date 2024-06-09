import { Coordinates, ParseSingleResult, PositionFormat } from "./types";
import { toUtm } from "./utm";
import { toMgrs } from "./mgrs";

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

  if (format === PositionFormat.MGRS) {
    const mgrs = toMgrs(coordinates);
    return `${mgrs.zoneNumber}${mgrs.zoneChar} ${mgrs.designator} ${
      mgrs.easting % 100000
    } ${mgrs.northing % 100000}`;
  }
  return "Not implemented!";
}
