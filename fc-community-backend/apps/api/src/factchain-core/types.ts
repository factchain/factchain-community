import { ContractTransactionResponse } from "ethers";

export type Config = {
  LOOKBACK_DAYS: string;
  // chain vars
  MAIN_CONTRACT_OWNER_PKEY: string;
  INFRA_RPC_URL: string;
  MAIN_CONTRACT_ADDRESS: string;
  NFT_721_CONTRACT_ADDRESS: string;
  NFT_1155_CONTRACT_ADDRESS: string;
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
  noteCreatorAddress: string;
  raterAddress: string;
  value: number;
};

export type Note = {
  postUrl: string;
  creatorAddress: string;
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

export type ContractAddresses = {
  main: string;
  nft721: string;
  nft1155: string;
};

export type ContractsResponse = {
  contracts: ContractAddresses;
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
