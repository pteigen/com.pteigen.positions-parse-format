import { tryParsePosition } from "../src/positionParser";
import { roundToNumDecimals } from "../src/util";

test("MGRS 1", () => {
  const result = tryParsePosition("32U LC 56001 48827");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(6.908303);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(51.871614);
  }
});

test("MGRS 2", () => {
  const result = tryParsePosition("39K TT 06005 74580");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(48.188505);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.103542);
  }
});
test("MGRS 2 - lowercase spaces", () => {
  const result = tryParsePosition("39k   tt   06005  74580");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(48.188505);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.103542);
  }
});
