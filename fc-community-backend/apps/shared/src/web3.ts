import { EventLog, ethers, ContractTransactionResponse } from "ethers";
import {
  Note,
  XCommunityNote,
  NoteReader,
  Rating,
  FactChainEvent,
  NoteWriter,
} from "./types";
import {
  createNFT721DataFromNote,
  getNFT1155DatafromXCommunityNote,
  createNFT1155DatafromXCommunityNote,
} from "./nftService";
import { getNoteSignature, timePeriodToBlockPeriods } from "./utils";
import {
  FC_COMMUNITY_JSON_ABI,
  FC_NFT_JSON_ABI,
  MINIMUM_STAKE_PER_NOTE,
  MINIMUM_STAKE_PER_RATING,
} from "./contractsAbi";
import { Config, XSignedNoteIDResponse } from "./types";

export class FactChainBackend implements NoteReader, NoteWriter {
  private _config: Config;
  private _provider: ethers.AbstractProvider;
  private _fcCommunity: ethers.Contract;
  private _fcNFT: ethers.Contract;

  constructor(config: Config) {
    this._config = config;
    this._provider = new ethers.JsonRpcProvider(this._config.INFRA_RPC_URL);
    const wallet = new ethers.Wallet(config.OWNER_PKEY, this._provider);
    this._fcCommunity = new ethers.Contract(
      this._config.MAIN_CONTRACT_ADDRESS,
      FC_COMMUNITY_JSON_ABI,
      wallet,
    );
    this._fcNFT = new ethers.Contract(
      this._config.NFT_721_CONTRACT_ADDRESS,
      FC_NFT_JSON_ABI,
      wallet,
    );
  }

  getBlockNumber = async (): Promise<number> => {
    return await this._provider.getBlockNumber();
  };

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
      creatorAddress: result[2],
      finalRating: parseInt(result[3]),
    };
  };

  getNotes = async (
    predicate: (postUrl: string, creator: string) => boolean,
    lookBackDays: number,
  ): Promise<Array<Note>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    const today = new Date();
    const from = new Date(today.getTime() - lookBackDays * 24 * 60 * 60 * 1000);
    console.log(`getting notes between ${from} and ${today}`);

    const block_periods = timePeriodToBlockPeriods(
      from,
      today,
      currentBlockNumber,
    );

    let notePromises: Promise<Note>[] = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteCreated", period[0], period[1]);
      const relatedEvents = events.filter((e) =>
        predicate(e.args[0], e.args[1]),
      );

      if (relatedEvents) {
        notePromises = notePromises.concat(
          relatedEvents.map(async (event) => {
            return await this.getNote(event.args[0], event.args[1]);
          }),
        );
      }
    }
    const notes = await Promise.all(notePromises);
    return notes;
  };

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
    const currentBlockNumber = await this._provider.getBlockNumber();
    const today = new Date();
    const from = new Date(today.getTime() - lookBackDays * 24 * 60 * 60 * 1000);
    const block_periods = timePeriodToBlockPeriods(
      from,
      today,
      currentBlockNumber,
    );
    var ratings: Array<Rating> = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteRated", period[0], period[1]);
      ratings = ratings.concat(
        events.map((event) => ({
          postUrl: event.args[0],
          noteCreatorAddress: event.args[1],
          raterAddress: event.args[2],
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
    const transactionResponse = await this._fcCommunity.createNote(
      postUrl,
      text,
      {
        value: MINIMUM_STAKE_PER_NOTE,
      },
    );
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

  mintNote721 = async (note: Note): Promise<ContractTransactionResponse> => {
    const metadataIpfsHash = await createNFT721DataFromNote(
      note,
      this._config.REPLICATE_API_TOKEN,
      this._config.PINATA_JWT,
    );
    return await this._fcNFT.mint(note.creatorAddress, metadataIpfsHash);
  };

  getXNoteID = async (note: XCommunityNote): Promise<XSignedNoteIDResponse> => {
    const tokenID = await getNFT1155DatafromXCommunityNote(
      note,
      this._config.AWS_ACCESS_KEY,
      this._config.AWS_SECRET_ACCESS_KEY,
      this._config.AWS_REGION,
      this._config.AWS_BUCKET,
    );
    const signer = new ethers.Wallet(this._config.BACKEND_PKEY, this._provider);
    const noteSignature = await getNoteSignature(tokenID, signer);
    return {
      id: tokenID,
      hash: noteSignature.hash,
      signature: noteSignature.signature,
    };
  };

  createXNoteMetadata = async (
    note: XCommunityNote,
  ): Promise<XSignedNoteIDResponse> => {
    const tokenID = await createNFT1155DatafromXCommunityNote(
      note,
      this._config.REPLICATE_API_TOKEN,
      this._config.AWS_ACCESS_KEY,
      this._config.AWS_SECRET_ACCESS_KEY,
      this._config.AWS_REGION,
      this._config.AWS_BUCKET,
    );
    const signer = new ethers.Wallet(this._config.BACKEND_PKEY, this._provider);
    const noteSignature = await getNoteSignature(tokenID, signer);
    return {
      id: tokenID,
      hash: noteSignature.hash,
      signature: noteSignature.signature,
    };
  };
}
