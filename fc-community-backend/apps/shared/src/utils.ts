export function time_period_to_block_periods(
  from: Date,
  to: Date,
  currentBlock: number,
  dateNowFixed?: Date,
): Array<[number, number]> {
  // Ethereum block production time in seconds
  const ethAvgBlockTime = 12;
  // https://support.quicknode.com/hc/en-us/articles/10258449939473-Understanding-the-10-000-Block-Range-Limit-for-querying-Logs-and-Events
  const maxBlockDifference = 10000;
  // Calculate the number of blocks based on the time difference
  const timeDeltaToFromSeconds = Math.abs(to.getTime() - from.getTime()) / 1000;
  const blocksBetweenFromAndTo = Math.ceil(
    timeDeltaToFromSeconds / ethAvgBlockTime,
  );
  const blocksRange = Math.min(blocksBetweenFromAndTo, maxBlockDifference);

  const dateNow = dateNowFixed ? dateNowFixed : new Date();
  const timeDeltaSeconds = Math.ceil(
    Math.abs(dateNow.getTime() - to.getTime()) / 1000,
  );
  const toBlocksNumber =
    currentBlock - Math.ceil(timeDeltaSeconds / ethAvgBlockTime);
  const fromBlocksNumber = toBlocksNumber - blocksBetweenFromAndTo;

  const blockNumbers: Array<[number, number]> = [];

  for (
    let blocks = fromBlocksNumber;
    blocks < toBlocksNumber;
    blocks += blocksRange
  ) {
    const startBlock = blocks + 1;
    const endBlock =
      startBlock + Math.min(blocksRange, toBlocksNumber - startBlock);
    blockNumbers.push([startBlock, endBlock]);
  }
  return blockNumbers;
}
