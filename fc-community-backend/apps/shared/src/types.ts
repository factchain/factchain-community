import { ContractTransactionResponse, EventLog } from "ethers";

export type Config = {
  LOOKBACK_DAYS: string;
  // chain vars
  OWNER_PKEY: string;
  INFRA_RPC_URL: string;
  MAIN_CONTRACT_ADDRESS: string;
  NFT_CONTRACT_ADDRESS: string;
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
};

export type Rating = {
  postUrl: string;
  creator: string;
  value: number;
};

export type Note = {
  postUrl: string;
  creator: string;
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

export type FactChainEvent =
  | "ReserveFunded"
  | "NoteCreated"
  | "NoteRated"
  | "RaterRewarded"
  | "RaterSlashed"
  | "CreatorRewarded"
  | "CreatorSlashed"
  | "NoteFinalised";

export interface NoteReader {
  getNote: (postUrl: string, creator: string) => Promise<Note>;
  getNotes: (
    predicate: (postUrl: string, creator: string) => boolean,
    lookBackDays: number,
  ) => Promise<Array<Note>>;
  getRatings: (from: Date, to: Date) => Promise<Array<Rating>>;
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
  ) => Promise<ContractTransactionResponse>;
  mintNote721: (note: Note) => Promise<ContractTransactionResponse>;
  createXNoteMetadata: (note: XCommunityNote) => Promise<XSignedNoteIDResponse>;
}