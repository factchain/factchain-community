import { listenToEvents } from "./events";
import { writeEvent } from "./mongo";

async function run() {
  listenToEvents((factchainEvent) => {
    console.log("Created factchain event", factchainEvent);
    writeEvent(factchainEvent);
  });
}
run().catch(console.dir);
