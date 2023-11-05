import { ContractTransactionResponse } from "ethers";

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
  getNotes: (postUrl: string) => Promise<Array<Note>>;
  getRatings: (from: Date, to: Date) => Promise<Array<Rating>>;
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
  mintNote: (note: Note) => Promise<ContractTransactionResponse>;
}
