import { Coordinates } from "./types";
import { degreesToRadians } from "./geo";

const utmZonesNorth: string = "NPQRSTUVWXX";
const utmZonesSouth: string = "MLKJHGFEDC";

export interface Utm {
  zoneChar: string;
  zoneNumber: number;
  easting: number;
  northing: number;
}

export function utmZone(
  coordinates: Coordinates
): Pick<Utm, "zoneNumber" | "zoneChar"> {
  const utmCharIndex = Math.floor(Math.abs(coordinates.lat) / 8);
  const utmChar =
    coordinates.lat >= 84
      ? "Z"
      : coordinates.lat >= 0
      ? utmZonesNorth.charAt(utmCharIndex)
      : utmZonesSouth.charAt(utmCharIndex);

  let zoneOffset =
    Math.floor(((coordinates.lon % 180) + 180) / UTM_ZONE_WIDTH) + 1;
  if (utmChar === "V" && zoneOffset === 31 && coordinates.lon >= 3) {
    zoneOffset += 1;
  }

  if (utmChar === "X" && zoneOffset === 32) {
    zoneOffset += coordinates.lon >= 9 ? 1 : -1;
  }

  if (utmChar === "X" && zoneOffset === 34) {
    zoneOffset += coordinates.lon >= 21 ? 1 : -1;
  }

  if (utmChar === "X" && zoneOffset === 36) {
    zoneOffset += coordinates.lon >= 33 ? 1 : -1;
  }

  return { zoneChar: utmChar, zoneNumber: zoneOffset };
}

/**
 * First eccentricity squared
 */
const eccentricitySquared = 0.00669438;

/**
 * Scale factor along the central meridian
 */
const SCALE_FACTOR = 0.9996;

/**
 * Semimajor axis (half the width of the earth) in meters
 */
const SEMI_MAJOR_AXIS = 6378137;

/**
 * The easting of the central meridian of each UTM zone
 */
const EASTING_OFFSET = 500000;

/**
 * The northing of the equator for southern hemisphere locations (in UTM)
 */
const NORTHING_OFFFSET = 10000000;

/**
 * UTM zone width in degrees
 */
const UTM_ZONE_WIDTH = 6;

export function utmCoordinates(
  coordinates: Coordinates,
  zoneNumber: Utm["zoneNumber"]
): Pick<Utm, "easting" | "northing"> {
  const latRadians = degreesToRadians(coordinates.lat);
  const longRadians = degreesToRadians(coordinates.lon);
  const LongOrigin =
    (zoneNumber - 1) * UTM_ZONE_WIDTH - 180 + UTM_ZONE_WIDTH / 2;
  const LongOriginRad = degreesToRadians(LongOrigin);

  const eccPrimeSquared = eccentricitySquared / (1 - eccentricitySquared);

  const N =
    SEMI_MAJOR_AXIS /
    Math.sqrt(
      1 - eccentricitySquared * Math.sin(latRadians) * Math.sin(latRadians)
    );
  const T = Math.tan(latRadians) * Math.tan(latRadians);
  const C = eccPrimeSquared * Math.cos(latRadians) * Math.cos(latRadians);
  const A = Math.cos(latRadians) * (longRadians - LongOriginRad);

  const M =
    SEMI_MAJOR_AXIS *
    ((1 -
      eccentricitySquared / 4 -
      (3 * Math.pow(eccentricitySquared, 2)) / 64 -
      (5 * Math.pow(eccentricitySquared, 3)) / 256) *
      latRadians -
      ((3 * eccentricitySquared) / 8 +
        (3 * Math.pow(eccentricitySquared, 2)) / 32 +
        (45 * Math.pow(eccentricitySquared, 3)) / 1024) *
        Math.sin(2 * latRadians) +
      ((15 * Math.pow(eccentricitySquared, 2)) / 256 +
        (45 * Math.pow(eccentricitySquared, 3)) / 1024) *
        Math.sin(4 * latRadians) -
      ((35 * Math.pow(eccentricitySquared, 3)) / 3072) *
        Math.sin(6 * latRadians));

  const easting =
    SCALE_FACTOR *
      N *
      (A +
        ((1 - T + C) * Math.pow(A, 3)) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) *
          Math.pow(A, 5)) /
          120) +
    EASTING_OFFSET;

  let northing =
    SCALE_FACTOR *
    (M +
      N *
        Math.tan(latRadians) *
        (Math.pow(A, 2) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4)) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) *
            Math.pow(A, 6)) /
            720));
  if (coordinates.lat < 0) {
    northing += NORTHING_OFFFSET;
  }
  return {
    easting: Math.floor(easting),
    northing: Math.floor(northing),
  };
}

export function toUtm(coordinates: Coordinates): Utm {
  const zone = utmZone(coordinates);
  const utmCoords = utmCoordinates(coordinates, zone.zoneNumber);
  return { ...zone, ...utmCoords };
}
