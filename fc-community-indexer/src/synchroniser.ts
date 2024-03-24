import { readNetworkBlocks, writeEvents } from "./mongo";
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
          networkFromBlock.lastBlock + 1,
          // Find the toBlock
          networkToBlocks.find(
            (networkToBlock) =>
              networkToBlock.networkName === networkFromBlock.networkName,
          )!.lastBlock,
        ),
      ),
    )
  ).flat();

  await writeEvents(events);
}
run().catch(console.dir);
