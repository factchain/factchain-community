import { timePeriodToBlockPeriods, toEip191 } from "../src/utils";
import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { getBytes } from "ethers";

describe("timePeriodToBlockPeriods", () => {
  const currentBlock = 4_484_229;
  const currentDate = new Date("2023-10-13T20:00:00Z");

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(currentDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should handle three hours period correctly", () => {
    const fromDate = new Date("2023-10-13T16:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");

    const expectedBlockRanges: Array<[number, number]> = [[4483029, 4483929]];

    const result = timePeriodToBlockPeriods(fromDate, toDate, currentBlock);
    expect(result).toEqual(expectedBlockRanges);
  });

  it("should handle one hour period correctly", () => {
    const fromDate = new Date("2023-10-13T18:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");
    const expectedShortBlockRanges: Array<[number, number]> = [
      [4483629, 4483929],
    ];

    const result = timePeriodToBlockPeriods(fromDate, toDate, currentBlock);
    expect(result).toEqual(expectedShortBlockRanges);
  });

  it("should handle a long time period", () => {
    // delta = 73 h
    const fromDate = new Date("2023-10-10T18:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");

    // 10 000 blocks ~= 33 hours
    const expectedLongBlockRanges: Array<[number, number]> = [
      [4462029, 4472029], // 10000 ~= 33 h
      [4472029, 4482029], // 10000 ~= 33 h
      [4482029, 4483929], // 1893 ~= 6h
    ];

    const result = timePeriodToBlockPeriods(fromDate, toDate, currentBlock);
    expect(result).toEqual(expectedLongBlockRanges);
  });

  it("should return a single range of 1 block when the time diff is 12 seconds", () => {
    const fromDate = new Date(currentDate.getTime());
    const toDate = new Date(currentDate.getTime() + 12 * 1_000);

    // 10 000 blocks ~= 33 hours
    const singleBlockRange: Array<[number, number]> = [
      [currentBlock, currentBlock + 1],
    ];

    const result = timePeriodToBlockPeriods(fromDate, toDate, currentBlock);
    expect(result).toEqual(singleBlockRange);
  });

  describe("toEIP191", () => {
    const res = toEip191(424273286);
    expect(res.idHash).toEqual(
      "84fac280d097e9c99d8522dd6adb8fcb46d9c1d0798d309b3abfd511d24e43b8",
    );
    expect(res.preparedMessage).toEqual(
      "0xfa1acf69350e1a516e6fe636864fa6a5e273836341e49bf6496741068aef68a6",
    );
    console.log(res);
  });
});
