export function roundToNumDecimals(input: number, numDecimals: number): number {
  const powerOfTen = Math.pow(10, numDecimals);
  return Math.round(input * powerOfTen) / powerOfTen;
}
