import { mgrsToUtm, toMgrs } from "../src/mgrs";

test("MGRS South West", () => {
  const actual = toMgrs({ lat: -43.27534, lon: -162.583051 });
  expect(actual.zoneChar).toEqual("G");
  expect(actual.zoneNumber).toEqual(3);
  expect(actual.designator).toEqual("XN");
  expect(actual.easting).toEqual(96123);
  expect(actual.northing).toEqual(5771);
});

test("mgrs to coord - south west", () => {
  const utm = mgrsToUtm({
    zoneNumber: 21,
    zoneChar: "K",
    designator: "TA",
    easting: 2730,
    northing: 25297,
  });
  expect(utm.easting).toEqual(202730);
  expect(utm.northing).toEqual(8025297);
});

test("mgrs to coord - north east", () => {
  const utm = mgrsToUtm({
    zoneNumber: 35,
    zoneChar: "X",
    designator: "PB",
    easting: 76142,
    northing: 90811,
  });
  expect(utm.easting).toEqual(676142);
  expect(utm.northing).toEqual(8190811);
});

test("mgrs to coord - north west", () => {
  const utm = mgrsToUtm({
    zoneNumber: 6,
    zoneChar: "W",
    designator: "WD",
    easting: 19323,
    northing: 56338,
  });
  expect(utm.easting).toEqual(519323);
  expect(utm.northing).toEqual(7856338);
});

test("mgrs to coord - south east", () => {
  const utm = mgrsToUtm({
    zoneNumber: 59,
    zoneChar: "G",
    designator: "MM",
    easting: 78440,
    northing: 41717,
  });
  expect(utm.easting).toEqual(478440);
  expect(utm.northing).toEqual(5141717);
});
