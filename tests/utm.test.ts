import { toUtm, utmZone } from "../src/utm";

test("utmzone 45 10", () => {
  expect(utmZone({ lat: 45, lon: 10 })).toEqual({
    zoneChar: "T",
    zoneNumber: 32,
  });
});

test("utmzone 60 5", () => {
  expect(utmZone({ lat: 60, lon: 5 })).toEqual({
    zoneChar: "V",
    zoneNumber: 32,
  });
});

test("utmzone 55 5", () => {
  expect(utmZone({ lat: 55, lon: 5 })).toEqual({
    zoneChar: "U",
    zoneNumber: 31,
  });
});

test("utmzone 80 8", () => {
  expect(utmZone({ lat: 80, lon: 8 })).toEqual({
    zoneChar: "X",
    zoneNumber: 31,
  });
});

test("utmzone 80 10", () => {
  expect(utmZone({ lat: 80, lon: 10 })).toEqual({
    zoneChar: "X",
    zoneNumber: 33,
  });
});

test("utmzone 80 29", () => {
  expect(utmZone({ lat: 80, lon: 29 })).toEqual({
    zoneChar: "X",
    zoneNumber: 35,
  });
});

test("utmzone 80 45", () => {
  expect(utmZone({ lat: 80, lon: 45 })).toEqual({
    zoneChar: "X",
    zoneNumber: 38,
  });
});

test("northing - 1", () => {
  const utm = toUtm({ lat: 45, lon: 10 });
  expect(utm.northing).toBe(4983436);
});
