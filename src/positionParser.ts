import { ParseResult } from "./types";
import { getMgrsRegExp, toLatLon } from "./mgrs";
import { getUtmRegExp, utmToLatLon } from "./utm";

export function tryParsePosition(input: string): ParseResult {
  input = input.trim();

  const mgrsMatch = input.match(getMgrsRegExp());
  if (mgrsMatch) {
    const zoneNumber = parseInt(mgrsMatch[1]);
    const zoneChar = mgrsMatch[2].toUpperCase();
    const designator = mgrsMatch[3].toUpperCase();
    const easting =
      mgrsMatch[4] !== undefined
        ? parseInt(mgrsMatch[4])
        : mgrsMatch[6] !== undefined
        ? 10 * parseInt(mgrsMatch[6])
        : mgrsMatch[8] !== undefined
        ? 100 * parseInt(mgrsMatch[8])
        : 1000 * parseInt(mgrsMatch[10]);
    const northing =
      mgrsMatch[5] !== undefined
        ? parseInt(mgrsMatch[5])
        : mgrsMatch[7] !== undefined
        ? 10 * parseInt(mgrsMatch[7])
        : mgrsMatch[9] !== undefined
        ? 100 * parseInt(mgrsMatch[9])
        : 1000 * parseInt(mgrsMatch[11]);

    return {
      isValid: true,
      coordinates: toLatLon({
        zoneChar,
        zoneNumber,
        designator,
        easting,
        northing,
      }),
    };
  }

  const utmMatch = input.match(getUtmRegExp());
  if (utmMatch) {
    const zoneNumber = parseInt(utmMatch[1]);
    const zoneChar = utmMatch[2].toUpperCase();
    const easting = parseInt(utmMatch[3]);
    const northing = parseInt(utmMatch[4]);

    return {
      isValid: true,
      coordinates: utmToLatLon({
        zoneChar,
        zoneNumber,
        easting,
        northing,
      }),
    };
  }
  return {
    isValid: false,
  };
}
