import { mgrsToUtm, toMgrs } from "../src/mgrs";

test("MGRS South West", () => {
  const actual = toMgrs({ lat: -43.27534, lon: -162.583051 });
  expect(actual.zoneChar).toEqual("G");
  expect(actual.zoneNumber).toEqual(3);
  expect(actual.designator).toEqual("XN");
  expect(actual.easting).toEqual(96123);
  expect(actual.northing).toEqual(5771);
});

test("mgrs to coord - southwest", () => {
  const utm = mgrsToUtm({
    zoneNumber: 21,
    zoneChar: "K",
    designator: "TA",
    easting: 2730,
    northing: 25297,
  });
  expect(utm.northing).toEqual(8025297);
  expect(utm.easting).toEqual(202730);
});
