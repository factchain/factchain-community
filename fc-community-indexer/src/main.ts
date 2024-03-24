import { readNetworkBlocks, writeEvents, writeNetworkBlocks } from "./mongo";
import { getEventsForNetwork, getNetworkToBlocks } from "./events";
import { NetworkBlock } from "./types";

async function run() {
  const networkFromBlocks: NetworkBlock[] = await readNetworkBlocks();
  // Compute the new network blocks once and use it for all networks
  const networkToBlocks: NetworkBlock[] = await getNetworkToBlocks();

  const events = (
    await Promise.all(
      networkFromBlocks.map(async (networkFromBlock) =>
        getEventsForNetwork(
          networkFromBlock.networkName,
          networkFromBlock.fromBlock,
          // Find the toBlock
          networkToBlocks.find(
            (networkToBlock) =>
              networkToBlock.networkName === networkFromBlock.networkName
          )!.fromBlock
        ),
      ),
    )
  ).flat();

  await writeEvents(events);
  await writeNetworkBlocks(networkToBlocks);
}
run().catch(console.dir);
