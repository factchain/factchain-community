import { ContractTransactionResponse } from "ethers";

export type Config = {
  LOOKBACK_DAYS: string;
  USEFUL_NOTE_THRESHOLD: string;
  MINIMUM_RATING: string;
  // chain vars
  ETHEREUM_SEPOLIA_NFT_MINTER_PKEY: string;
  ETHEREUM_SEPOLIA_NOTE_FINALISER_PKEY: string;
  BASE_MAINNET_NFT_MINTER_PKEY: string;
  BASE_MAINNET_NOTE_FINALISER_PKEY: string;
  // AI image generation
  REPLICATE_API_TOKEN: string;
  // ipfs vars
  PINATA_JWT: string;
  // AWS
  AWS_ACCESS_KEY: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  AWS_BUCKET: string;
  // Index signature to allow any string key
  BACKEND_PKEY: string;
  [key: string]: string;
  // Database vars
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  MONGO_CLUSTER: string;
  MONGO_APP_NAME: string;
};

export type Network = {
  INFRA_RPC_URL: string;
  MAIN_CONTRACT_ADDRESS: string;
  NFT_CONTRACT_ADDRESS: string;
  SFT_CONTRACT_ADDRESS: string;
  X_CONTRACT_ADDRESS: string;
};

export type FactchainEventArg = {
  name: string;
  value: string;
};

export type FactchainEventName =
  | "ReserveFunded"
  | "NoteCreated"
  | "NoteRated"
  | "RaterRewarded"
  | "RaterSlashed"
  | "CreatorRewarded"
  | "CreatorSlashed"
  | "NoteFinalised";

export type FactchainEvent = {
  networkName: string;
  contractAddress: string;
  eventName: FactchainEventName;
  blockTimestamp: number;
  blockNumber: number;
  eventArgs: FactchainEventArg[];
};

export type Rating = {
  postUrl: string;
  noteCreatorAddress: string;
  raterAddress: string;
  value: number;
};

export type Note = {
  postUrl: string;
  creatorAddress: string;
  // TODO: createdAt shouldn't be optional
  createdAt?: number;
  content?: string;
  finalRating?: number;
  ratings?: Array<number>;
  imageUrl?: string;
};

export type XCommunityNote = {
  url: string;
  content?: string;
};

export type XSignedNoteIDResponse = {
  id: number;
  hash: string;
  signature: string;
};

export type NotesResponse = {
  notes: Array<Note>;
};

export interface NoteReader {
  getNote: (
    postUrl: string,
    creator: string,
    timestamp?: number,
  ) => Promise<Note>;
  getNotes: (
    predicate: (postUrl: string, creator: string) => boolean,
    lookBackDays: number,
  ) => Promise<Array<Note>>;
  getRating: (
    postUrl: string,
    creator: string,
    rater: string,
  ) => Promise<Rating>;
  getRatings: (lookBackDays: number) => Promise<Array<Rating>>;
  getXNoteID: (note: XCommunityNote) => Promise<XSignedNoteIDResponse>;
}

export interface NoteWriter {
  createNote: (
    postUrl: string,
    text: string,
  ) => Promise<ContractTransactionResponse>;
  rateNote: (
    postUrl: string,
    creator: string,
    rating: number,
  ) => Promise<ContractTransactionResponse>;
  finaliseNote: (
    postUrl: string,
    creator: string,
    rating: number,
    nonce?: number,
  ) => Promise<ContractTransactionResponse>;
  mintNote721: (
    note: Note,
    nonce?: number,
  ) => Promise<ContractTransactionResponse>;
  createXNoteMetadata: (note: XCommunityNote) => Promise<XSignedNoteIDResponse>;
}
