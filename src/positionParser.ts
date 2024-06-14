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
    const easting = parseInt(mgrsMatch[4]);
    const northing = parseInt(mgrsMatch[5]);

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
