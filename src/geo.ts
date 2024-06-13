import { Coordinates } from "./types";

export const R = 6378100; // 6378137;

export function computeDistanceBetween(
  coordinateFrom: Coordinates,
  coordinateTo: Coordinates
): number {
  const sinHalfDeltaLon = Math.sin(
    (Math.PI * (coordinateTo.lon - coordinateFrom.lon)) / 360
  );
  const sinHalfDeltaLat = Math.sin(
    (Math.PI * (coordinateTo.lat - coordinateFrom.lat)) / 360
  );
  const a =
    sinHalfDeltaLat * sinHalfDeltaLat +
    sinHalfDeltaLon *
      sinHalfDeltaLon *
      Math.cos((Math.PI * coordinateFrom.lat) / 180) *
      Math.cos((Math.PI * coordinateTo.lat) / 180);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
