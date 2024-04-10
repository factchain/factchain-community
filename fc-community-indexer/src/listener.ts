import { ethers } from "ethers";
import { listenToEvents } from "./events";
import { writeEvent } from "./mongo";
import express from "express";

async function run(): Promise<ethers.Contract[]> {
  return await listenToEvents((factchainEvent) => {
    writeEvent(factchainEvent);
  });
}

const app = express();
const port = process.env.PORT;
let listeningContracts: ethers.Contract[] = [];

app.get("/", async (req, res) => {
  const contractsHaveListeners = await Promise.all(
    listeningContracts.map(async (contract) => {
      const listenerCount = await contract.listenerCount();
      console.log(`Listening to ${contract.address} events, with ${listenerCount} listeners`);
      return listenerCount > 0;
    })
  );
  if (contractsHaveListeners.every((hasListeners) => hasListeners)) {
    res.send("OK");
  } else {
    res.status(500).send("Not all contracts have listeners");
  }
});

app.listen(port, async () => {
  console.log(`synchroniser listening on port ${port}`);
  listeningContracts = await run();
});
