import { Coordinates, Utm } from "./types";
import { degreesToRadians, radiansToDegrees } from "./geo";
import { roundToNumDecimals } from "./util";

const utmZonesNorth: string = "NPQRSTUVWXX";
const utmZonesSouth: string = "MLKJHGFEDC";

export function getUtmRegExp(): string {
  return (
    "^(\\d{1,2})([" +
    utmZonesNorth +
    utmZonesSouth +
    utmZonesNorth.toLowerCase() +
    utmZonesSouth.toLowerCase() +
    "])[\\sEe]*(\\d+)[eE]*\\s+[Nn]*(\\d+)?[Nn]*$"
  );
}

export function utmZone(
  coordinates: Coordinates
): Pick<Utm, "zoneNumber" | "zoneChar"> {
  const utmCharIndex = Math.floor(Math.abs(coordinates.lat) / 8);
  const utmChar =
    coordinates.lat >= 84
      ? coordinates.lon < 0
        ? "Y"
        : "Z"
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
    easting: roundToNumDecimals(easting, 3),
    northing: roundToNumDecimals(northing, 3),
  };
}

export function toUtm(coordinates: Coordinates): Utm {
  const zone = utmZone(coordinates);
  const utmCoords = utmCoordinates(coordinates, zone.zoneNumber);
  return { ...zone, ...utmCoords };
}

export function utmToLatLon(utm: Utm): Coordinates {
  const UTMNorthing = utm.northing;
  const UTMEasting = utm.easting;
  const { zoneChar, zoneNumber } = utm;

  const e1 =
    (1 - Math.sqrt(1 - eccentricitySquared)) /
    (1 + Math.sqrt(1 - eccentricitySquared));

  // remove 500,000 meter offset for longitude
  const x = UTMEasting - EASTING_OFFSET;
  let y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (utmZonesSouth.indexOf(zoneChar) >= 0) {
    y -= NORTHING_OFFFSET; // remove offset used for southern hemisphere
  }

  // +HALF_UTM_ZONE_WIDTH puts origin in middle of zone
  const LongOrigin =
    (zoneNumber - 1) * UTM_ZONE_WIDTH - 180 + UTM_ZONE_WIDTH / 2;

  const eccPrimeSquared = eccentricitySquared / (1 - eccentricitySquared);

  const M = y / SCALE_FACTOR;
  const mu =
    M /
    (SEMI_MAJOR_AXIS *
      (1 -
        eccentricitySquared / 4 -
        (3 * eccentricitySquared * eccentricitySquared) / 64 -
        (5 * eccentricitySquared * eccentricitySquared * eccentricitySquared) /
          256));

  const phi1Rad =
    mu +
    ((3 * e1) / 2 - (27 * e1 * e1 * e1) / 32) * Math.sin(2 * mu) +
    ((21 * e1 * e1) / 16 - (55 * e1 * e1 * e1 * e1) / 32) * Math.sin(4 * mu) +
    ((151 * e1 * e1 * e1) / 96) * Math.sin(6 * mu);
  // double phi1 = ProjMath.radiansToDegrees(phi1Rad);

  const N1 =
    SEMI_MAJOR_AXIS /
    Math.sqrt(1 - eccentricitySquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  const T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  const C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  const R1 =
    (SEMI_MAJOR_AXIS * (1 - eccentricitySquared)) /
    Math.pow(
      1 - eccentricitySquared * Math.sin(phi1Rad) * Math.sin(phi1Rad),
      1.5
    );
  const D = x / (N1 * SCALE_FACTOR);

  let lat =
    phi1Rad -
    ((N1 * Math.tan(phi1Rad)) / R1) *
      (Math.pow(D, 2) / 2 -
        ((5 + 3 * T1 + 10 * C1 - 4 * Math.pow(C1, 2) - 9 * eccPrimeSquared) *
          Math.pow(D, 4)) /
          24 +
        ((61 +
          90 * T1 +
          298 * C1 +
          45 * Math.pow(T1, 2) -
          252 * eccPrimeSquared -
          3 * Math.pow(C1, 2)) *
          Math.pow(D, 6)) /
          720);
  lat = radiansToDegrees(lat);

  let lon =
    (D -
      ((1 + 2 * T1 + C1) * Math.pow(D, 3)) / 6 +
      ((5 -
        2 * C1 +
        28 * T1 -
        3 * C1 * C1 +
        8 * eccPrimeSquared +
        24 * T1 * T1) *
        Math.pow(D, 5)) /
        120) /
    Math.cos(phi1Rad);
  lon = LongOrigin + radiansToDegrees(lon);
  return {
    lat,
    lon,
  };
}
