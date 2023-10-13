import { EventLog, ethers } from "ethers";
import * as fs from "fs";

import {
  getEligibleNotesFromRatings,
  getEligibleRatings,
  Note,
} from "./notesSelector";

export const provider = new ethers.JsonRpcProvider(
  process.env["INFRA_RPC_URL"],
);
const factChainContractAddress = process.env["FACTCHAIN_CONTRACT_ADDRESS"]!;
const ownerPk = process.env["OWNER_PKEY"]!;
const owner = new ethers.Wallet(ownerPk, provider);
const abi = JSON.parse(fs.readFileSync("./src/factchainAbi.json", "utf-8"));
const factChainContract = new ethers.Contract(
  factChainContractAddress,
  abi,
  owner,
);

const MINIMUM_STAKE_PER_RATING = 10_000;
const MINIMUM_STAKE_PER_NOTE = 100_000;

export type FactChainEvent =
  | "ReserveFunded"
  | "NoteCreated"
  | "NoteRated"
  | "RaterRewarded"
  | "RaterSlashed"
  | "CreatorRewarded"
  | "CreatorSlashed"
  | "NoteFinalised";

export const getEvents = async (
  eventType: FactChainEvent,
  fromBlock: number,
  toBlock?: number,
): Promise<Array<EventLog>> => {
  console.log(
    `getEvents command called with type=${eventType} and option fromBlock=${fromBlock}, toBlock=${toBlock}`,
  );
  const logs = await factChainContract.queryFilter(
    factChainContract.filters[eventType],
    -fromBlock,
    toBlock,
  );
  const eventLogs = logs
    .filter((log) => log.hasOwnProperty("args"))
    .map((e) => <EventLog>e);

  console.log(eventLogs);
  return eventLogs;
};

export const getNote = async (
  postUrl: string,
  creator: string,
): Promise<void> => {
  const notes = await factChainContract.communityNotes(postUrl, creator);
  console.log(notes);
  return notes;
};

export const createNote = async (
  pkey: string,
  url: string,
  text: string,
): Promise<void> => {
  const user = new ethers.Wallet(pkey, provider);
  const factChainContract = new ethers.Contract(
    factChainContractAddress,
    abi,
    user,
  );
  const transactionResponse = await factChainContract.createNote(url, text, {
    value: MINIMUM_STAKE_PER_NOTE,
  });
  console.log(transactionResponse);
  return transactionResponse;
};

export const rateNote = async (
  pkey: string,
  url: string,
  creator: string,
  rating: number,
): Promise<void> => {
  const user = new ethers.Wallet(pkey, provider);
  const factChainContract = new ethers.Contract(
    factChainContractAddress,
    abi,
    user,
  );
  if (!(rating > 0 && rating < 6)) {
    throw new Error("Bad rating!");
  }
  const transactionResponse = await factChainContract.rateNote(
    url,
    creator,
    rating,
    { value: MINIMUM_STAKE_PER_RATING },
  );
  console.log(transactionResponse);
  return transactionResponse;
};

export const finaliseNote = async (
  url: string,
  creator: string,
  rating: number,
): Promise<void> => {
  if (!(rating > 0 && rating < 6)) {
    throw new Error("Bad rating!");
  }
  const transactionResponse = await factChainContract.finaliseNote(
    url,
    creator,
    rating,
  );
  console.log(transactionResponse);
  return transactionResponse;
};

export const getEligibleNotes = async (
  minimumRatingsPerNote: number,
): Promise<Array<Note>> => {
  const oldEnoughRatings = await getEligibleRatings();
  const eligibleNotes = getEligibleNotesFromRatings(
    oldEnoughRatings,
    minimumRatingsPerNote,
  );
  console.log(eligibleNotes);
  return eligibleNotes;
};
