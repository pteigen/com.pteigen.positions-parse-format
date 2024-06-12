import { Coordinates, PositionFormat } from "./types";
import { toUtm } from "./utm";
import { toMgrs } from "./mgrs";

// export function parsePositionString(input: string): ParseSingleResult {
//   return {
//     isValid: false,
//   };
// }

function padLeftWithZero(input: number): string {
  return input.toString().padStart(5, "0");
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
    return `${mgrs.zoneNumber}${mgrs.zoneChar} ${
      mgrs.designator
    } ${padLeftWithZero(mgrs.easting)} ${padLeftWithZero(mgrs.northing)}`;
  }
  return "Not implemented!";
}
