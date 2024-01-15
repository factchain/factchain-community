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

const finaliseNoteHelper = async (
  note: Note,
): Promise<[number, ContractTransactionResponse]> => {
  const fc = new FactChainBackend(config);
  // Rocket Science factchain scoring algorithm!
  // Half Round Down Average
  const finalRating = ~~(
    note.ratings!.reduce((a, b) => a + Number(b), 0) / note.ratings!.length
  );
  console.log(
    `Final Rating of note on ${note.postUrl} created by ${note.creatorAddress} is ${finalRating}`,
  );
  const transactionResponse = await fc.finaliseNote(
    note.postUrl,
    note.creatorAddress,
    finalRating,
  );
  return [finalRating, transactionResponse];
};

export const finaliseNote = async (
  postUrl: string,
  creator: string,
  minimumRatingsPerNote: number,
): Promise<ContractTransactionResponse[] | null> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  const note = await ns.getNote(postUrl, creator);
  if (note.ratings!.length < minimumRatingsPerNote) {
    console.log("Not enough rating");
    return null;
  }
  if (note.finalRating) {
    console.log("Note already finalised!");
    return null;
  }
  const [finalRating, finaliseTransactionResponse] =
    await finaliseNoteHelper(note);
  const mintTransactionResponse = await mintNote(
    note.content!,
    note.postUrl,
    note.creatorAddress,
    finalRating,
  );
  return [finaliseTransactionResponse, mintTransactionResponse];
};

export const finaliseNotes = async (
  from: number,
  minimumRatingsPerNote: number,
): Promise<ContractTransactionResponse[]> => {
  const fc = new FactChainBackend(config);
  const ns = new NoteService(fc, fc);
  // select notes created within the time period and with enough ratings
  const notesToFinalise = await ns.getNotesToFinalise(
    from,
    minimumRatingsPerNote,
  );
  let responses = [];
  for (const note of notesToFinalise) {
    console.log(
      `finalising note on ${note.postUrl} created by ${note.creatorAddress}`,
    );
    const [finalRating, finaliseTransactionResponse] =
      await finaliseNoteHelper(note);
    responses.push(finaliseTransactionResponse);
    const mintTransactionResponse = await mintNote(
      note.content!,
      note.postUrl,
      note.creatorAddress,
      finalRating,
    );
    responses.push(mintTransactionResponse);
  }
  console.log(responses);
  console.log(`minted ${notesToFinalise.length} NFTs`);
  return responses;
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
