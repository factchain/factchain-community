import { MongoClient, ServerApiVersion } from "mongodb";
import { NetworkBlock } from "./types";
import { supportedNetworks } from "./events";

const getClient = () => {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
};

const readLastBlockNumber = async (networkName: string) => {
  const client = getClient();
  try {
    const collection = client.db("fc-community").collection("events");
    const document = await collection.findOne(
      { networkName },
      { sort: { blockNumber: -1 } },
    );
    return document ? document.blockNumber : 0;
  } finally {
    await client.close();
  }
};

export const readNetworkBlocks = async (): Promise<NetworkBlock[]> => {
  const client = getClient();
  try {
    return Promise.all(
      supportedNetworks.map(async (network) => {
        return {
          networkName: network.name,
          fromBlock: await readLastBlockNumber(network.name),
        };
      }),
    );
  } finally {
    await client.close();
  }
};

export const writeEvents = async (events: any[]) => {
  console.log(`Writing ${events.length} events`);
  if (events.length <= 0) {
    return;
  }
  const client = getClient();
  try {
    await client.connect();
    const collection = client.db("fc-community").collection("events");
    await collection.insertMany(events);
  } finally {
    await client.close();
  }
};

export const writeEvent = async (event: any) => {
  console.log("Writing new event", event);
  const client = getClient();
  try {
    await client.connect();
    const collection = client.db("fc-community").collection("events");
    await collection.insertOne(event);
  } finally {
    await client.close();
  }
};
