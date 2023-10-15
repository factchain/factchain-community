import { time_period_to_block_periods } from "../src/utils";
import { describe, it, expect } from "@jest/globals";

describe("time_period_to_block_periods", () => {
  const blockNow = 4484229;
  const dateNow = new Date("2023-10-13T20:00:00Z");

  it("should handle three hours period correctly", () => {
    const fromDate = new Date("2023-10-13T16:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");

    const expectedBlockRanges: Array<[number, number]> = [
      [4483030, 4483929],
      // ... (more block ranges based on the given totalBlocks and maxBlockDifference)
    ];

    const result = time_period_to_block_periods(
      fromDate,
      toDate,
      blockNow,
      dateNow,
    );
    expect(result).toEqual(expectedBlockRanges);
  });

  it("should handle one hour period correctly", () => {
    const fromDate = new Date("2023-10-13T18:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");
    const expectedShortBlockRanges: Array<[number, number]> = [
      [4483630, 4483929],
    ];

    const result = time_period_to_block_periods(
      fromDate,
      toDate,
      blockNow,
      dateNow,
    );
    expect(result).toEqual(expectedShortBlockRanges);
  });

  it("should handle a long time period", () => {
    // delta = 73 h
    const fromDate = new Date("2023-10-10T18:00:00Z");
    const toDate = new Date("2023-10-13T19:00:00Z");

    // 10 000 blocks ~= 33 hours
    const expectedLongBlockRanges: Array<[number, number]> = [
      [4462030, 4472030], // 10000 ~= 33 h
      [4472030, 4482030], // 10000 ~= 33 h
      [4482030, 4483929], // 1893 ~= 6h
    ];

    const result = time_period_to_block_periods(
      fromDate,
      toDate,
      blockNow,
      dateNow,
    );
    expect(result).toEqual(expectedLongBlockRanges);
  });
});
