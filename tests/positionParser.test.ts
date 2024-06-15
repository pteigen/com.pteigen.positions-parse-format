import { toPositionString, tryParsePosition } from "../src";
import { roundToNumDecimals } from "../src/util";
import { PositionFormat } from "../src/types";

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

test("MGRS 3 - no spaces", () => {
  const result = tryParsePosition("39KTT0600574580");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(48.188505);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.103542);
  }
});

test("MGRS 3 - 4 digits", () => {
  const result = tryParsePosition("39KTT0600 7458");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(48.188457);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.103541);
  }
});

test("MGRS 4 - 3 digits", () => {
  const result = tryParsePosition("39KTT060745");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 7)).toEqual(48.1884445);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.104263);
  }
});

test("MGRS 4 - 2 digits", () => {
  const result = tryParsePosition("39KTT0674");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 7)).toEqual(48.1883639);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-20.108776);
  }
});

test("UTM 1", () => {
  const result = tryParsePosition("32Q 239307 2584870");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(6.450101);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(23.352746);
  }
});

test("UTM 1", () => {
  const result = tryParsePosition("32Q 239307 2584870");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(6.450101);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(23.352746);
  }
});

test("UTM 2", () => {
  const result = tryParsePosition(" 32V 204520E 6250297N");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(4.22248);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(56.305106);
  }
});

test("UTM 3", () => {
  const result = tryParsePosition(" 34j   613193  6585859N");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    expect(roundToNumDecimals(result.coordinates.lon, 6)).toEqual(22.183862);
    expect(roundToNumDecimals(result.coordinates.lat, 6)).toEqual(-30.855079);
  }
});

test("From string to string via coords", () => {
  const result = tryParsePosition("39KTT0674");
  expect(result.isValid).toEqual(true);
  if (result.isValid) {
    const result2 = toPositionString(result.coordinates, PositionFormat.MGRS);
    expect(result2).toEqual("39K TT 06000 74000");
  }
});
