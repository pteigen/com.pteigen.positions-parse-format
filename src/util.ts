export function roundToNumDecimals(input: number, numDecimals: number): number {
  const powerOfTen = Math.pow(10, numDecimals);
  return Math.round(input * powerOfTen) / powerOfTen;
}
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
