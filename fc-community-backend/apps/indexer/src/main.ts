import { MongoClient, ServerApiVersion } from 'mongodb';
import { getEventsForNetwork } from './events';

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${process.env.MONGO_APP_NAME}`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const networkFromBlocks = [
      {
        networkName: "Ethereum Sepolia",
        fromBlock: 5519272,
      },
      {
        networkName: "Base Mainnet",
        fromBlock: 11654488,
      },
    ];
    const events = (await Promise.all(
      networkFromBlocks.map(async (networkFromBlock) => getEventsForNetwork(networkFromBlock.networkName, networkFromBlock.fromBlock))
    )).flat();

    console.log(JSON.stringify(events, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value
    ));
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
