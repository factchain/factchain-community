import { listenToEvents } from "./events";
import { writeEvent } from "./mongo";
import express from "express";

async function run() {
  listenToEvents((factchainEvent) => {
    console.log("Created factchain event", factchainEvent);
    writeEvent(factchainEvent);
  });
}

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`synchroniser listening on port ${port}`);
  run().catch(console.dir);
});
