import { EventLog, Log, ethers } from "ethers";
import * as fs from "fs";

const provider = new ethers.JsonRpcProvider(process.env["INFRA_RPC_URL"]);
const factChainContractAddress = process.env["FACTCHAIN_CONTRACT_ADDRESS"]!;
const ownerPk = process.env["OWNER_PKEY"]!;
const owner = new ethers.Wallet(ownerPk, provider);
const abi = JSON.parse(fs.readFileSync("./src/factchainAbi.json", "utf-8"));
const factChainContract = new ethers.Contract(
  factChainContractAddress,
  abi,
  owner,
);

export type FactChainEvent =
  | "ReserveFunded"
  | "NoteCreated"
  | "NoteRated"
  | "RaterRewarded"
  | "RaterSlashed"
  | "CreatorRewarded"
  | "CreatorSlashed"
  | "NoteFinalised";

export const getEvents = async (eventType: FactChainEvent, fromBlock: number, toBlock?: number): Promise<Array<Log | EventLog>> => {
  console.log(`getEvents command called with type=${eventType} and option fromBlock=${fromBlock}, toBlock=${toBlock}`);
  const logs = await factChainContract.queryFilter(
    factChainContract.filters[eventType],
    fromBlock,
  );
  console.log(logs);
  return logs;
};
