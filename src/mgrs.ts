import { Coordinates, Mgrs, Utm } from "./types";
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
  console.log({ utmNorthing, northingIndex, northingLetter });

  const eastingNoCorrection = Math.floor(utmEasting / 100000);
  const eastingIndex =
    eastingNoCorrection +
    (utmZone % 3 === 1 ? 0 : utmZone % 3 === 2 ? 8 : 16) -
    1;

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
    northing: utm.northing % 100000,
    easting: utm.easting % 100000,
    designator: rowDesignator,
  };
}

export function mgrsToUtm(mgrs: Mgrs): Utm {
  const northingLetter = mgrs.designator.charAt(1);
  console.log("northingLetter = " + northingLetter);
  const indexOfNorthingLetter = letters.indexOf(northingLetter);
  const numDesignatorNorthing =
    (indexOfNorthingLetter + 20 - (mgrs.zoneNumber % 2 === 0 ? 5 : 0)) % 20;
  console.log("numDesignatorNorthing = " + numDesignatorNorthing);

  const minNorthing = getMinNorthing(mgrs.zoneChar);
  let northing = numDesignatorNorthing * 100000 + mgrs.northing;
  while (northing < minNorthing) {
    northing += 2_000_000;
  }

  console.log(northing);

  return {
    ...mgrs,
    northing,
  };
}

function getMinNorthing(zoneLetter: string) {
  let northing;
  switch (zoneLetter) {
    case "C":
      northing = 1100000;
      break;
    case "D":
      northing = 2000000;
      break;
    case "E":
      northing = 2800000;
      break;
    case "F":
      northing = 3700000;
      break;
    case "G":
      northing = 4600000;
      break;
    case "H":
      northing = 5500000;
      break;
    case "J":
      northing = 6400000;
      break;
    case "K":
      northing = 7300000;
      break;
    case "L":
      northing = 8200000;
      break;
    case "M":
      northing = 9100000;
      break;
    case "N":
      northing = 0;
      break;
    case "P":
      northing = 800000;
      break;
    case "Q":
      northing = 1700000;
      break;
    case "R":
      northing = 2600000;
      break;
    case "S":
      northing = 3500000;
      break;
    case "T":
      northing = 4400000;
      break;
    case "U":
      northing = 5300000;
      break;
    case "V":
      northing = 6200000;
      break;
    case "W":
      northing = 7000000;
      break;
    case "X":
      northing = 7900000;
      break;
    default:
      northing = -1;
  }
  if (northing >= 0) {
    return northing;
  } else {
    throw new TypeError(`Invalid zone letter: ${zoneLetter}`);
  }
}
