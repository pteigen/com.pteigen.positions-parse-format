import { ParseResult } from "./types";
import { toLatLon } from "./mgrs";

const utmLetters = "NPQRSTUVWXXMLKJHGFEDC";
const mgrsLettersNorthing = "ABCDEFGHJKLMNPQRSTUV";
const mgrsLettersEasting = mgrsLettersNorthing + "WXYZ";
const mgrsRegex =
  "^(\\d{1,2})([" +
  utmLetters +
  utmLetters.toLowerCase() +
  "])\\s*([" +
  mgrsLettersEasting +
  mgrsLettersEasting.toLowerCase() +
  "]+[" +
  mgrsLettersNorthing +
  mgrsLettersNorthing.toLowerCase() +
  "]+)\\s*(\\d{2,5})\\s+(\\d{2,5})?";
export function tryParsePosition(input: string): ParseResult {
  const mgrsMatch = input.match(mgrsRegex);
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
  return {
    isValid: false,
  };
}
