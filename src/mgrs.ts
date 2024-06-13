import { Coordinates, Mgrs, Utm } from "./types";
import { toUtm, utmToLatLon } from "./utm";

const DesignatorLetters = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function zoneOffsetForEasting(zoneNumber: number): number {
  return zoneNumber % 3 === 1 ? 0 : zoneNumber % 3 === 2 ? 8 : 16;
}

export function mgrsDesignator(utm: Omit<Utm, "zoneChar">): string {
  let northingIndex = Math.floor(utm.northing / 100000);
  if (utm.zoneNumber % 2 === 0) {
    northingIndex += 5;
  }

  const northingLetter = DesignatorLetters.charAt(northingIndex % 20);

  const eastingNoCorrection = Math.floor(utm.easting / 100000);
  const eastingIndex =
    eastingNoCorrection + zoneOffsetForEasting(utm.zoneNumber) - 1;

  const eastingLetter = DesignatorLetters.charAt(eastingIndex % 24);

  return eastingLetter + northingLetter;
}

export function toMgrs(coordinate: Coordinates): Mgrs {
  const utm = toUtm(coordinate);
  const rowDesignator = mgrsDesignator(utm);
  return {
    ...utm,
    northing: utm.northing % 100000,
    easting: utm.easting % 100000,
    designator: rowDesignator,
  };
}

export function mgrsToUtm(mgrs: Mgrs): Utm {
  const northingLetter = mgrs.designator.charAt(1);
  const indexOfNorthingLetter = DesignatorLetters.indexOf(northingLetter);
  const numDesignatorNorthing =
    (indexOfNorthingLetter + 20 - (mgrs.zoneNumber % 2 === 0 ? 5 : 0)) % 20;

  const minNorthing = getMinNorthing(mgrs.zoneChar);
  let northing = numDesignatorNorthing * 100000 + mgrs.northing;
  northing =
    northing + Math.round((minNorthing - northing) / 2_000_000) * 2_000_000;

  const eastingZoneDiffs =
    (DesignatorLetters.indexOf(mgrs.designator.charAt(0)) +
      DesignatorLetters.length -
      zoneOffsetForEasting(mgrs.zoneNumber)) %
    DesignatorLetters.length;
  const easting = (eastingZoneDiffs + 1) * 100000 + mgrs.easting;

  return {
    ...mgrs,
    northing,
    easting,
  };
}

export function toLatLon(mgrs: Mgrs): Coordinates {
  const utm = mgrsToUtm(mgrs);
  return utmToLatLon(utm);
}
function getMinNorthing(zoneLetter: string) {
  if (zoneLetter === "C") {
    return 1100000;
  } else if (zoneLetter === "D") {
    return 2000000;
  } else if (zoneLetter === "E") {
    return 2800000;
  } else if (zoneLetter === "F") {
    return 3700000;
  } else if (zoneLetter === "G") {
    return 4600000;
  } else if (zoneLetter === "H") {
    return 5500000;
  } else if (zoneLetter === "J") {
    return 6400000;
  } else if (zoneLetter === "K") {
    return 7300000;
  } else if (zoneLetter === "L") {
    return 8200000;
  } else if (zoneLetter === "M") {
    return 9100000;
  } else if (zoneLetter === "N") {
    return 0;
  } else if (zoneLetter === "P") {
    return 800000;
  } else if (zoneLetter === "Q") {
    return 1700000;
  } else if (zoneLetter === "R") {
    return 2600000;
  } else if (zoneLetter === "S") {
    return 3500000;
  } else if (zoneLetter === "T") {
    return 4400000;
  } else if (zoneLetter === "U") {
    return 5300000;
  } else if (zoneLetter === "V") {
    return 6200000;
  } else if (zoneLetter === "W") {
    return 7000000;
  } else if (zoneLetter === "X") {
    return 7900000;
  } else {
    throw new TypeError(`Invalid zone letter: ${zoneLetter}`);
  }
}
