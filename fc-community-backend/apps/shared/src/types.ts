import { TransactionResponse } from "ethers";

export type Rating = {
  url: string;
  creator: string;
  value: number;
};

export type Note = {
  url: string;
  creator: string;
  ratings?: Array<number>;
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
  getNote: (url: string, creator: string) => Promise<Note>;
  getRatings: (from: Date, to: Date) => Promise<Array<Rating>>;
}

export interface NoteWriter {
  createNote: (url: string, text: string) => Promise<TransactionResponse>;
  rateNote: (
    url: string,
    creator: string,
    rating: number,
  ) => Promise<TransactionResponse>;
  finaliseNote: (
    url: string,
    creator: string,
    rating: number,
  ) => Promise<TransactionResponse>;
}
