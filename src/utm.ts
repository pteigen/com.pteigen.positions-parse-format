import proj4 from "proj4";
import { Coordinates } from "./types";

const utmZonesNorth: string = "NPQRSTUVWXX";
const utmZonesSouth: string = "MLKJHGFEDC";

interface Utm {
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
    coordinates.lat >= 0
      ? utmZonesNorth.charAt(utmCharIndex)
      : utmZonesSouth.charAt(utmCharIndex);

  let zoneOffset = Math.floor(((coordinates.lon % 180) + 180) / 6) + 1;
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

export function utmCoordinates(
  coordinates: Coordinates,
  zoneNumber: Utm["zoneNumber"]
): Pick<Utm, "easting" | "northing"> {
  proj4.defs(
    "UTM" + zoneNumber,
    "+proj=utm +zone=" +
      zoneNumber.toString() +
      (coordinates.lat >= 0 ? "" : " +south") +
      " +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
  );

  const utmCoords = proj4("UTM" + zoneNumber, [
    coordinates.lon,
    coordinates.lat,
  ]);
  return {
    easting: Math.floor(utmCoords[0]),
    northing: Math.floor(utmCoords[1]),
  };
}

export function toUtm(coordinates: Coordinates): Utm {
  const zone = utmZone(coordinates);
  const utmCoords = utmCoordinates(coordinates, zone.zoneNumber);
  return { ...zone, ...utmCoords };
}
