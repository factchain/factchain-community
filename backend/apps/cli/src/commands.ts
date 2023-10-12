import { ethers } from "ethers";
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

const help = [
  {
    header: "factchain",
    content: [
      "A command line to interact with the factchain contract.",
      "",
      "usage: factchain <command> [options]",
    ],
  },
];

const options = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Show help",
  },
];

export type FactChainEvent =
  | "ReserveFunded"
  | "NoteCreated"
  | "NoteRated"
  | "RaterRewarded"
  | "RaterSlashed"
  | "CreatorRewarded"
  | "CreatorSlashed"
  | "NoteFinalised";

const events = {
  command: "events",
  description: "List factchain contract events",
  help: [
    {
      content: "{grey $} factchain events [options]",
    },
  ],
  options: [
    {
      name: "until",
      description: "Look back until last n blocks",
      type: Number,
      default: 100,
    },
  ],
  run: async (event: any): Promise<void> => {
    console.log(event);
    await factChainContract.queryFilter(
      factChainContract.filters.NoteRated,
      -10000,
    );
  },
};

export default {
  help,
  options,
  subCommands: [events],
};
