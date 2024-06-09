import { Coordinates } from "./types";
import { toUtm, Utm } from "./utm";

const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";

type Mgrs = Utm & {
  designator: string;
};

export function mgrsDesignator(
  utmZone: number,
  utmNorthing: number,
  utmEasting: number
): string {
  const eastingIndex = Math.floor(utmEasting / 100000);
  let northingIndex = Math.floor(utmNorthing / 100000);
  if (utmZone % 2 === 0) {
    northingIndex += 5;
  }

  const eastingLetter = letters.charAt(eastingIndex % 24);
  const northingLetter = letters.charAt(northingIndex % 20);
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
