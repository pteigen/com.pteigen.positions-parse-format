import { toPositionString } from "../src/positionParser";
import { PositionFormat } from "../src/types";

test("UTM North East", () => {
  expect(
    toPositionString({ lat: 59.123456, lon: 12.456789 }, PositionFormat.UTM)
  ).toEqual("33V 354432 6556572");
});
