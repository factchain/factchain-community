import { EventLog, ContractTransactionResponse } from "ethers";
import { FactChainContracts } from "./factchain-core/web3";
import { FactChainEvent, Note } from "./factchain-core/types";
import { NoteService } from "./factchain-core/noteService";

export const getEvents = async (
  eventType: FactChainEvent,
  fromBlock: number,
  toBlock: number,
): Promise<Array<EventLog>> => {
  console.log(
    `getEvents command called with type=${eventType} and option fromBlock=${fromBlock}, toBlock=${toBlock}`,
  );
  const fc = new FactChainContracts(process.env["OWNER_PKEY"]!);
  const eventLogs = await fc.getEvents(eventType, fromBlock, toBlock);
  console.log(eventLogs);
  return eventLogs;
};

export const getNote = async (
  postUrl: string,
  creator: string,
): Promise<Note> => {
  const fc = new FactChainContracts(process.env["OWNER_PKEY"]!);
  const notes = await fc.getNote(postUrl, creator);
  console.log(notes);
  return notes;
};

export const createNote = async (
  pkey: string,
  postUrl: string,
  text: string,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainContracts(pkey);
  const transactionResponse = await fc.createNote(postUrl, text);
  console.log(transactionResponse);
  return transactionResponse;
};

export const rateNote = async (
  pkey: string,
  postUrl: string,
  creator: string,
  rating: number,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainContracts(pkey);
  const transactionResponse = await fc.rateNote(postUrl, creator, rating);
  console.log(transactionResponse);
  return transactionResponse;
};

export const finaliseNote = async (
  postUrl: string,
  creator: string,
  rating: number,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainContracts(process.env["OWNER_PKEY"]!);
  const transactionResponse = await fc.finaliseNote(postUrl, creator, rating);
  console.log(transactionResponse);
  return transactionResponse;
};

export const getEligibleNotes = async (
  from: string,
  to: string,
  minimumRatingsPerNote: number,
): Promise<Array<Note>> => {
  const fc = new FactChainContracts(process.env["OWNER_PKEY"]!);
  const ns = new NoteService(fc, fc);
  const eligibleNotes = await ns.getNotesToFinalise(
    new Date(from),
    new Date(to),
    minimumRatingsPerNote,
  );
  console.log(eligibleNotes);
  return eligibleNotes;
};

export const mintNote = async (
  pkey: string,
  text: string,
  postUrl: string,
  creator: string,
): Promise<ContractTransactionResponse> => {
  const fc = new FactChainContracts(pkey);
  return await fc.mintNote({
    postUrl: postUrl,
    creator: creator,
    content: text,
  });
};
