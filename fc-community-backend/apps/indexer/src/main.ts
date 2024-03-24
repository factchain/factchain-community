import { readNetworkBlocks, writeEvents, writeNetworkBlocks } from "./mongo";
import { getEventsForNetwork, getNetworkFromBlocks } from "./events";
import { NetworkBlock } from "./types";

async function run() {
  const networkFromBlocks: NetworkBlock[] = await readNetworkBlocks();
  const events = (
    await Promise.all(
      networkFromBlocks.map(async (networkFromBlock) =>
        getEventsForNetwork(
          networkFromBlock.networkName,
          networkFromBlock.fromBlock,
        ),
      ),
    )
  ).flat();

  await writeEvents(events);
  const newNetworkFromBlocks: NetworkBlock[] = await getNetworkFromBlocks();
  await writeNetworkBlocks(newNetworkFromBlocks);
}
run().catch(console.dir);
