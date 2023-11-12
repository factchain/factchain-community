import { EventLog, ethers, ContractTransactionResponse } from "ethers";
import { Note, NoteReader, Rating, FactChainEvent, NoteWriter } from "./types";
import { createNFTDataFromNote } from "./nftService";
import { timePeriodToBlockPeriods } from "./utils";
import { FC_COMMUNITY_JSON_ABI, FC_NFT_JSON_ABI, MINIMUM_STAKE_PER_NOTE, MINIMUM_STAKE_PER_RATING } from "./contractsAbi";

export class FactChainContracts implements NoteReader, NoteWriter {
  private _provider: ethers.AbstractProvider;
  private _fcCommunity: ethers.Contract;
  private _fcNFT: ethers.Contract;

  constructor(pkey: string) {
    this._provider = new ethers.JsonRpcProvider(process.env["INFRA_RPC_URL"]);
    const user_identity = new ethers.Wallet(pkey, this._provider);
    this._fcCommunity = new ethers.Contract(
      process.env["FACTCHAIN_CONTRACT_ADDRESS"]!,
      FC_COMMUNITY_JSON_ABI,
      user_identity,
    );
    this._fcNFT = new ethers.Contract(
      process.env["FACTCHAIN_NFT_CONTRACT_ADDRESS"]!,
      FC_NFT_JSON_ABI,
      user_identity,
    );
  }

  getEvents = async (
    eventType: FactChainEvent,
    fromBlock: number,
    toBlock: number,
  ): Promise<Array<EventLog>> => {
    const logs = await this._fcCommunity.queryFilter(
      this._fcCommunity.filters[eventType],
      fromBlock,
      toBlock,
    );
    const eventLogs = logs
      .filter((log) => log.hasOwnProperty("args"))
      .map((e) => <EventLog>e);
    return eventLogs;
  };

  getNote = async (postUrl: string, creator: string): Promise<Note> => {
    const result = await this._fcCommunity.communityNotes(postUrl, creator);
    return {
      postUrl: result[0],
      content: result[1],
      creator: result[2],
      finalRating: result[3],
    };
  };

  getNotes = async (postUrl: string): Promise<Array<Note>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    // TODO: see if 5 days lookback is suitable for the demo
    const today = new Date();
    const lookbackDays = parseInt(
      process.env["GET_NOTES_LOOKBACK_DAYS"] || "5",
    );
    const from = new Date(today.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
    console.log(
      `Getting notes created on '${postUrl}' between ${from} and ${today}`,
    );

    const blockPeriods = timePeriodToBlockPeriods(
      from,
      today,
      currentBlockNumber,
    );
    let notePromises: Promise<Note>[] = [];
    for (const period of blockPeriods) {
      const events = await this.getEvents("NoteCreated", period[0], period[1]);
      console.log(
        `Notes between blocks ${period[0]} and ${period[1]}`,
        blockPeriods,
      );
      const relatedEvents = events.filter((e) => e.args[0] == postUrl);
      if (relatedEvents) {
        notePromises = notePromises.concat(
          relatedEvents.map(async (event) => {
            return await this.getNote(event.args[0], event.args[1]);
          }),
        );
      }
    }
    return await Promise.all(notePromises);
  };

  getRatings = async (from: Date, to: Date): Promise<Array<Rating>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    const blockPeriods = timePeriodToBlockPeriods(
      from,
      to,
      currentBlockNumber,
    );
    var ratings: Array<Rating> = [];
    for (const period of blockPeriods) {
      const events = await this.getEvents("NoteRated", period[0], period[1]);
      ratings = ratings.concat(
        events.map((event) => ({
          postUrl: event.args[0],
          creator: event.args[1],
          value: event.args[3],
        })),
      );
    }
    return ratings;
  };

  createNote = async (
    postUrl: string,
    text: string,
  ): Promise<ContractTransactionResponse> => {
    const transactionResponse = await this._fcCommunity.createNote(postUrl, text, {
      value: MINIMUM_STAKE_PER_NOTE,
    });
    return transactionResponse;
  };

  rateNote = async (
    postUrl: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._fcCommunity.rateNote(
      postUrl,
      creator,
      rating,
      {
        value: MINIMUM_STAKE_PER_RATING,
      },
    );
    return transactionResponse;
  };

  finaliseNote = async (
    postUrl: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._fcCommunity.finaliseNote(
      postUrl,
      creator,
      rating,
    );
    return transactionResponse;
  };

  mintNote = async (note: Note): Promise<ContractTransactionResponse> => {
    const metadataIpfsHash = await createNFTDataFromNote(note);
    return await this._fcNFT.mint(note.creator, metadataIpfsHash);
  }
}
