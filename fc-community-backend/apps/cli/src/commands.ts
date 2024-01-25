import { EventLog, ContractTransactionResponse } from "ethers";
import { FactChainBackend } from "./factchain-core/web3";
import {
  FactChainEvent,
  Note,
  Rating,
  XSignedNoteIDResponse,
} from "./factchain-core/types";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

export const getEvents = async (
  eventType: FactChainEvent,
  fromBlock: number,
  toBlock: number,
): Promise<Array<EventLog>> => {
  console.log(
    `getEvents command called with type=${eventType} and option fromBlock=${fromBlock}, toBlock=${toBlock}`,
  );
  const fc = new FactChainBackend(config);
  const eventLogs = await fc.getEvents(eventType, fromBlock, toBlock);
  console.log(eventLogs);
  return eventLogs;
};

export const getNote = async (
  postUrl: string,
  creator: string,
): Promise<Note> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  const note = await ns.getNote(postUrl, creator);
  console.log(note);
  return note;
};

export const getNotes = async (
  postUrl: string,
  from: number,
): Promise<Note[]> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  const notes = await ns.getNotes((_postUrl, _) => _postUrl === postUrl, from);
  console.log(notes);
  return notes;
};

export const createNote = async (
  postUrl: string,
  text: string,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainBackend(config);
  const transactionResponse = await fc.createNote(postUrl, text);
  console.log(transactionResponse);
  return transactionResponse;
};

export const rateNote = async (
  postUrl: string,
  creator: string,
  rating: number,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainBackend(config);
  const transactionResponse = await fc.rateNote(postUrl, creator, rating);
  console.log(transactionResponse);
  return transactionResponse;
};

export const getEligibleNotes = async (
  from: number,
  minimumRatingsPerNote: number,
): Promise<Array<Note>> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  const eligibleNotes = await ns.getNotesToFinalise(
    from,
    minimumRatingsPerNote,
  );
  console.log(eligibleNotes);
  return eligibleNotes;
};

export const mintNote = async (
  text: string,
  postUrl: string,
  creator: string,
  finalRating: number,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainBackend(config);
  return await fc.mintNote721({
    postUrl,
    creatorAddress: creator,
    content: text,
    finalRating,
  });
};

export const createXCommunityNoteNFTMetadata = async (
  text: string,
  noteUrl: string,
): Promise<XSignedNoteIDResponse> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  const res = await ns.createXNoteMetadata(noteUrl, text);
  console.log(res);
  return res;
};

export const getRating = async (
  postUrl: string,
  creator: string,
  rater: string,
): Promise<Rating> => {
  const fc = new FactChainBackend(config);
  const rating = await fc.getRating(postUrl, creator, rater);
  console.log(rating);
  return rating;
};

export const getNoteRaters = async (
  postUrl: string,
  creator: string,
): Promise<String[]> => {
  const fc = new FactChainBackend(config);
  const raters = await fc.getNoteRaters(postUrl, creator);
  console.log(raters);
  return raters;
};

export const setNFTContractInSFT = async (
  NFTContractAddress: string,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainBackend(config);
  const response = await fc.setNFTContractInSFT(NFTContractAddress);
  console.log(response);
  return response;
};
