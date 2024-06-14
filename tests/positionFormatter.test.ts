import { toPositionString } from "../src/positionFormatter";
import { PositionFormat } from "../src/types";

test("UTM North East", () => {
  expect(
    toPositionString({ lat: 59.123456, lon: 12.456789 }, PositionFormat.UTM)
  ).toEqual("33V 354432 6556572");
});

test("MGRS Case", () => {
  expect(
    toPositionString({ lat: -20.103542, lon: 48.188505 }, PositionFormat.MGRS)
  ).toEqual("39K TT 06004 74579");
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

test("MGRS North West - even", () => {
  expect(
    toPositionString({ lat: 48.221628, lon: -120.215209 }, PositionFormat.MGRS)
  ).toEqual("10U GU 06832 44683");
});

test("MGRS South West - even", () => {
  expect(
    toPositionString({ lat: -43.27534, lon: -162.583051 }, PositionFormat.MGRS)
  ).toEqual("3G XN 96123 05771");
});
