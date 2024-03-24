import { getLastBlock, writeEvents } from "./mongo";
import { getEventsForNetwork, supportedNetworks } from "./events";

async function run() {
  const networkFromBlocks = await Promise.all(
    supportedNetworks.map(async (network) => {
      const lastBlock = await getLastBlock(network.name);
      return {
        networkName: network.name,
        fromBlock: lastBlock,
      };
    }),
  );

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
}
run().catch(console.dir);
