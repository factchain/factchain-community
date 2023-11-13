export function timePeriodToBlockPeriods(
  from: Date,
  to: Date,
  currentBlock: number,
): Array<[number, number]> {
  // Ethereum block production time in milliseconds
  const ethAvgBlockTime = 12 * 1_000;
  // https://support.quicknode.com/hc/en-us/articles/10258449939473-Understanding-the-10-000-Block-Range-Limit-for-querying-Logs-and-Events
  const maxPeriodLength = 10_000;

  if (from > to) {
    const temp = from;
    from = to;
    to = temp;
  }

  const currentDate = new Date();
  const fromBlock =
    currentBlock -
    Math.floor((currentDate.getTime() - from.getTime()) / ethAvgBlockTime);
  const toBlock =
    currentBlock -
    Math.ceil((currentDate.getTime() - to.getTime()) / ethAvgBlockTime);
  const numberOfPeriods = Math.ceil((toBlock - fromBlock) / maxPeriodLength);

  return [...Array(numberOfPeriods).keys()].map((i) => {
    return [
      fromBlock + i * maxPeriodLength,
      Math.min(fromBlock + (i + 1) * maxPeriodLength, toBlock),
    ];
  });
}
