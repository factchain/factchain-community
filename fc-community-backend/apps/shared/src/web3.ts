import { EventLog, ethers, ContractTransactionResponse } from "ethers";
import * as fs from "fs";
import * as path from "path";

import { Note, NoteReader, Rating, FactChainEvent, NoteWriter } from "./types";
import { time_period_to_block_periods } from "./utils";

const MINIMUM_STAKE_PER_RATING = 10_000;
const MINIMUM_STAKE_PER_NOTE = 100_000;
const JSON_ABI = path.join(__dirname, "../../../shared/factchainAbi.json");

export class FactChainContract implements NoteReader, NoteWriter {
  private _provider: ethers.AbstractProvider;
  private _contract: ethers.Contract;

  constructor(pkey: string) {
    this._provider = new ethers.JsonRpcProvider(process.env["INFRA_RPC_URL"]);
    const user_identity = new ethers.Wallet(pkey, this._provider);
    const abi = JSON.parse(fs.readFileSync(JSON_ABI, "utf-8"));
    this._contract = new ethers.Contract(
      process.env["FACTCHAIN_CONTRACT_ADDRESS"]!,
      abi,
      user_identity,
    );
  }

  getEvents = async (
    eventType: FactChainEvent,
    fromBlock: number,
    toBlock: number,
  ): Promise<Array<EventLog>> => {
    const logs = await this._contract.queryFilter(
      this._contract.filters[eventType],
      fromBlock,
      toBlock,
    );
    const eventLogs = logs
      .filter((log) => log.hasOwnProperty("args"))
      .map((e) => <EventLog>e);
    return eventLogs;
  };

  getNote = async (postUrl: string, creator: string): Promise<Note> => {
    const result = await this._contract.communityNotes(postUrl, creator);
    return {
      url: result[0],
      content: result[1],
      creator: result[2],
    };
  };

  getNotes = async (postUrl: string): Promise<Array<Note>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    // TODO: see if 5 days lookback is suitable for the demo 
    const today = new Date();
    const fiveDaysbefore = new Date(today.getTime() - (5 * 24 * 60 * 60 * 1000))
    const block_periods = time_period_to_block_periods(
      fiveDaysbefore,
      today,
      currentBlockNumber,
    );
    let notes: Array<Note> = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteCreated", period[0], period[1]);
      const relatedEvents = events.filter((e) => e.args[0] == postUrl);
      if (relatedEvents) {
        const notePromises: Promise<Note>[] = relatedEvents.map(
          async (event) => {
            return await this.getNote(event.args[0], event.args[1]);
          },
        );
        const resolvedNotes = await Promise.all(notePromises);
        notes = notes.concat(resolvedNotes);
      }
    }
    return notes;
  };

  getRatings = async (from: Date, to: Date): Promise<Array<Rating>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    const block_periods = time_period_to_block_periods(
      from,
      to,
      currentBlockNumber,
    );
    var ratings: Array<Rating> = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteRated", period[0], period[1]);
      ratings = ratings.concat(
        events.map((event) => ({
          url: event.args[0],
          creator: event.args[1],
          value: event.args[3],
        })),
      );
    }
    return ratings;
  };

  createNote = async (
    url: string,
    text: string,
  ): Promise<ContractTransactionResponse> => {
    const transactionResponse = await this._contract.createNote(url, text, {
      value: MINIMUM_STAKE_PER_NOTE,
    });
    return transactionResponse;
  };

  rateNote = async (
    url: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._contract.rateNote(
      url,
      creator,
      rating,
      {
        value: MINIMUM_STAKE_PER_RATING,
      },
    );
    return transactionResponse;
  };

  finaliseNote = async (
    url: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._contract.finaliseNote(
      url,
      creator,
      rating,
    );
    return transactionResponse;
  };
}
