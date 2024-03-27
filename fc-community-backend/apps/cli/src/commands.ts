import { EventLog, ContractTransactionResponse } from "ethers";
import { BlockchainConnector } from "./factchain-core/web3";
import { DBConnector } from "./factchain-core/web2";
import {
  FactchainEventName,
  Note,
  Rating,
  XSignedNoteIDResponse,
} from "./factchain-core/types";
import { NoteService } from "./factchain-core/noteService";
import { config } from "./factchain-core/env";

import {
  NetworkConfigs,
  getNetworkConfig,
} from "./factchain-core/networks/config";

export const getEvents = async (
  eventType: FactchainEventName,
  fromBlock: number,
  toBlock: number,
  network: keyof NetworkConfigs,
): Promise<Array<EventLog>> => {
  console.log(
    `getEvents command called with type=${eventType} and option fromBlock=${fromBlock}, toBlock=${toBlock}`,
  );
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const eventLogs = await bc.getEvents(eventType, fromBlock, toBlock);
  console.log(eventLogs);
  return eventLogs;
};

export const getNote = async (
  postUrl: string,
  creator: string,
  network: keyof NetworkConfigs,
): Promise<Note> => {
  const reader = new DBConnector(config, getNetworkConfig(network));
  const ns = new NoteService(reader);
  const note = await ns.getNote(postUrl, creator);
  console.log(note);
  return note;
};

export const getNotes = async (
  postUrl: string,
  from: number,
  network: keyof NetworkConfigs,
): Promise<Note[]> => {
  const reader = new DBConnector(config, getNetworkConfig(network));
  const ns = new NoteService(reader);
  const notes = await ns.getNotes((_postUrl, _) => _postUrl === postUrl, from);
  console.log(notes);
  return notes;
};

export const createNote = async (
  postUrl: string,
  text: string,
  network: keyof NetworkConfigs,
): Promise<ContractTransactionResponse> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const transactionResponse = await bc.createNote(postUrl, text);
  console.log(transactionResponse);
  return transactionResponse;
};

export const rateNote = async (
  postUrl: string,
  creator: string,
  rating: number,
  network: keyof NetworkConfigs,
): Promise<ContractTransactionResponse> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const transactionResponse = await bc.rateNote(postUrl, creator, rating);
  console.log(transactionResponse);
  return transactionResponse;
};

export const getEligibleNotes = async (
  from: number,
  minimumRatingsPerNote: number,
  network: keyof NetworkConfigs,
): Promise<Array<Note>> => {
  const reader = new DBConnector(config, getNetworkConfig(network));
  const ns = new NoteService(reader);
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
  network: keyof NetworkConfigs,
): Promise<ContractTransactionResponse> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  return await bc.mintNote721({
    postUrl,
    creatorAddress: creator,
    content: text,
    finalRating,
  });
};

export const createXCommunityNoteNFTMetadata = async (
  text: string,
  noteUrl: string,
  network: keyof NetworkConfigs,
): Promise<XSignedNoteIDResponse> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const ns = new NoteService(bc, bc);
  const res = await ns.createXNoteMetadata(noteUrl, text);
  console.log(res);
  return res;
};

export const getRating = async (
  postUrl: string,
  creator: string,
  rater: string,
  network: keyof NetworkConfigs,
): Promise<Rating> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const rating = await bc.getRating(postUrl, creator, rater);
  console.log(rating);
  return rating;
};

export const getNoteRaters = async (
  postUrl: string,
  creator: string,
  network: keyof NetworkConfigs,
): Promise<String[]> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const raters = await bc.getNoteRaters(postUrl, creator);
  console.log(raters);
  return raters;
};

export const setNFTContractInSFT = async (
  NFTContractAddress: string,
  network: keyof NetworkConfigs,
): Promise<ContractTransactionResponse> => {
  const bc = new BlockchainConnector(config, getNetworkConfig(network));
  const response = await bc.setNFTContractInSFT(NFTContractAddress);
  console.log(response);
  return response;
};
