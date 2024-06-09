import { toPositionString } from "../src/positionParser";
import { PositionFormat } from "../src/types";

test("UTM North East", () => {
  expect(
    toPositionString({ lat: 59.123456, lon: 12.456789 }, PositionFormat.UTM)
  ).toEqual("33V 354432 6556572");
});

test("MGRS North East - odd", () => {
  expect(
    toPositionString({ lat: 59.123456, lon: 12.456789 }, PositionFormat.MGRS)
  ).toEqual("33V UF 54432 56572");
});

test("MGRS North East - even", () => {
  expect(
    toPositionString({ lat: 51.871618, lon: 6.908311 }, PositionFormat.MGRS)
  ).toEqual("32U LC 56001 48827");
});
