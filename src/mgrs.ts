import { Coordinates, Mgrs } from "./types";
import { toUtm } from "./utm";

const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";



export function mgrsDesignator(
  utmZone: number,
  utmNorthing: number,
  utmEasting: number
): string {
  let northingIndex = Math.floor(utmNorthing / 100000);
  if (utmZone % 2 === 0) {
    northingIndex += 5;
  }

  const northingLetter = letters.charAt(northingIndex % 20);

  const eastingNoCorrection = Math.floor(utmEasting / 100000);
  const eastingIndex = eastingNoCorrection + (utmZone % 3 === 1 ? 0 : utmZone % 3 === 2 ? 8 : 16) - 1;

  const eastingLetter = letters.charAt(eastingIndex % 24);
  
  return eastingLetter + northingLetter;
}

export function toMgrs(coordinate: Coordinates): Mgrs {
  const utm = toUtm(coordinate);
  const rowDesignator = mgrsDesignator(
    utm.zoneNumber,
    utm.northing,
    utm.easting
  );
  return {
    ...utm,
    designator: rowDesignator,
  };
}
