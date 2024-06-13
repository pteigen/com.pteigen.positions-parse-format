import { toUtm, utmToLatLon, utmZone } from "../src/utm";
import { roundToNumDecimals } from "../src/util";

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

test("UTM to and from", () => {
  const utm = toUtm({ lat: 45, lon: 10 });
  expect(Math.floor(utm.northing)).toBe(4983436);
  expect(Math.floor(utm.easting)).toBe(578815);

  const coordinates = utmToLatLon(utm);
  expect(coordinates !== null).toEqual(true);
  if (coordinates != null) {
    expect(roundToNumDecimals(coordinates.lat, 6)).toEqual(45);
    expect(roundToNumDecimals(coordinates.lon, 6)).toEqual(10);
  }
});

test("UTM to and from - many positions", () => {
  for (let lon = -179.999123; lon < 179.999123; lon += 0.267123) {
    for (let lat = -70.999123; lon < 70.999123; lon += 0.267123) {
      const utm = toUtm({ lat, lon });

      const coordinates = utmToLatLon(utm);

      expect(roundToNumDecimals(coordinates.lat, 6)).toBe(
        roundToNumDecimals(lat, 6)
      );
      expect(roundToNumDecimals(coordinates.lon, 6) + 0.1).toBe(
        roundToNumDecimals(lon, 6) + 0.1
      );
    }
  }
});
