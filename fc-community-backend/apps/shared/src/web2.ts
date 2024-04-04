import {
  Config,
  Note,
  NoteReader,
  Rating,
  XCommunityNote,
  XSignedNoteIDResponse,
  FactchainEventName,
  FactchainEvent,
} from "./types";
import { MongoClient, ServerApiVersion } from "mongodb";
import { ethers } from "ethers";
import { NetworkConfig } from "./networks/config";
import { FC_COMMUNITY_JSON_ABI } from "./contractsABIs/main";

export class DBConnector implements NoteReader {
  private _config: Config;
  private _network: NetworkConfig;
  private _fcCommunity: ethers.Contract;
  private _mainWallet: ethers.Signer;
  private _provider: ethers.AbstractProvider;

  constructor(config: Config, network: NetworkConfig) {
    this._config = config;
    this._network = network;
    this._provider = new ethers.JsonRpcProvider(this._network.INFRA_RPC_URL);
    this._mainWallet = new ethers.Wallet(
      config[`${network.NETWORK_NAME}_NOTE_FINALISER_PKEY`],
      this._provider,
    );
    this._fcCommunity = new ethers.Contract(
      this._network.MAIN_CONTRACT_ADDRESS,
      FC_COMMUNITY_JSON_ABI,
      this._mainWallet,
    );
  }

  getClient = () => {
    const uri = `mongodb+srv://${this._config.MONGO_USER}:${this._config.MONGO_PASSWORD}@${this._config.MONGO_CLUSTER}/?w=majority&appName=${this._config.MONGO_APP_NAME}`;
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

  getEvents = async (
    eventName: FactchainEventName,
    from: number,
    to: number,
  ): Promise<FactchainEvent[]> => {
    const client = this.getClient();
    try {
      const db = client.db("fc-community");
      const collection = db.collection("events");
      const cursor = collection.find({
        networkName: this._network.INFRA_RPC_URL.includes("sepolia")
          ? "Ethereum Sepolia"
          : "Base Mainnet",
        eventName: eventName,
        blockTimestamp: {
          $gte: from,
          $lte: to,
        },
      });
      const documents = await cursor.toArray();
      const events: FactchainEvent[] = documents.map((document) => ({
        networkName: document.networkName,
        contractAddress: document.contractAddress,
        eventName: document.eventName,
        blockTimestamp: document.blockTimestamp,
        blockNumber: document.blockNumber,
        eventArgs: document.eventArgs,
      }));
      return events;
    } finally {
      await client.close();
    }
  };

  // TODO: directly retrieve Note from mongodb
  getNote = async (
    postUrl: string,
    creator: string,
    timestamp?: number,
  ): Promise<Note> => {
    // TODO: timestamp shouldn't be optional
    const result = await this._fcCommunity.communityNotes(postUrl, creator);
    const note: Note = {
      postUrl: result[0],
      content: result[1],
      creatorAddress: result[2],
      finalRating: parseInt(result[3]),
    };
    if (timestamp !== undefined) {
      note.createdAt = timestamp;
    }
    return note;
  };

  getNotes = async (
    predicate: (postUrl: string, creator: string) => boolean,
    lookBackDays: number,
  ): Promise<Array<Note>> => {
    const currentDate = new Date();
    const fromDate = new Date(
      currentDate.getTime() - lookBackDays * 24 * 60 * 60 * 1000,
    );
    const events = await this.getEvents(
      "NoteCreated",
      fromDate.getTime() / 1000,
      currentDate.getTime() / 1000,
    );
    const relatedEvents = events.filter((e) =>
      predicate(e.eventArgs[0].value, e.eventArgs[1].value),
    );
    const notes = await Promise.all(
      relatedEvents.map(async (event) =>
        this.getNote(
          event.eventArgs[0].value,
          event.eventArgs[1].value,
          event.blockTimestamp,
        ),
      ),
    );
    return notes;
  };

  // TODO: directly retrieve Rating from mongodb
  getRating = async (
    postUrl: string,
    creator: string,
    rater: string,
  ): Promise<Rating> => {
    return {
      postUrl: postUrl,
      noteCreatorAddress: creator,
      raterAddress: rater,
      value: await this._fcCommunity.communityRatings(postUrl, creator, rater),
    };
  };

  getRatings = async (lookBackDays: number): Promise<Array<Rating>> => {
    const currentDate = new Date();
    const fromDate = new Date(
      currentDate.getTime() - lookBackDays * 24 * 60 * 60 * 1000,
    );
    const events = await this.getEvents(
      "NoteRated",
      fromDate.getTime() / 1000,
      currentDate.getTime() / 1000,
    );
    const ratings = events.map((event) => ({
      postUrl: event.eventArgs[0].value,
      noteCreatorAddress: event.eventArgs[1].value,
      raterAddress: event.eventArgs[2].value,
      value: parseInt(event.eventArgs[3].value),
    }));
    return ratings;
  };

  declare getXNoteID: (note: XCommunityNote) => Promise<XSignedNoteIDResponse>;
}
