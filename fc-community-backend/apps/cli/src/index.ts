#!/usr/bin/env node

import {
  getEvents,
  getNote,
  getNotes,
  getRating,
  createNote,
  rateNote,
  finaliseNote,
  finaliseNotes,
  getEligibleNotes,
  mintNote,
  createXCommunityNoteNFTMetadata,
  setNFTContractInSFT,
  getNoteRaters,
} from "./commands";

import { FactChainEvent } from "./factchain-core/types";

const { Command } = require("commander");
const figlet = require("figlet");

const program = new Command();

console.log(figlet.textSync("FactChain"));

program.version("1.0.0").description("FactChain command line");

program
  .command("events <eventType>")
  .description("get a list of events")
  .option("-f, --from <number>", "Start block", parseInt, 0)
  .option("-t, --to <number>", "End block", parseInt)
  .action(async (eventType: FactChainEvent, options: any) => {
    await getEvents(eventType, options.from, options.to);
  });

program
  .command("get-note")
  .description("get a factchain note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Creator address")
  .action(async (options: any) => {
    await getNote(options.url, options.creator);
  });

program
  .command("get-notes")
  .description("get factchain notes for a given post")
  .option("-u, --url <url>", "Post url")
  .option("-f, --from <number>", "lookback days")
  .action(async (options: any) => {
    await getNotes(options.url, options.from);
  });

program
  .command("create-note")
  .description("create a factchain note")
  .option("-u, --url <url>", "Post url")
  .option("-t, --text <text>", "Note content")
  .action(async (options: any) => {
    await createNote(options.url, options.text);
  });

program
  .command("rate-note")
  .description("rate a factchain note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rating <number>", "Note Rating", parseInt, 0)
  .action(async (options: any) => {
    await rateNote(options.url, options.creator, options.rating);
  });

program
  .command("finalise-note")
  .description("set factchain note final rating")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-m, --minimum <number>", "minimum note ratings", 1)
  .action(async (options: any) => {
    await finaliseNote(options.url, options.creator, options.minimum);
  });

program
  .command("finalise-notes")
  .description("set to all eligible factchain notes their final rating")
  .option("-f, --from <number>", "lookback days")
  .option("-m, --minimum <number>", "minimum note ratings", 1)
  .action(async (options: any) => {
    await finaliseNotes(options.from, options.minimum);
  });

program
  .command("get-eligible-notes")
  .description("get factchain notes to finalised")
  .option("-f, --from <number>", "lookback days")
  .option("-m, --minimum <number>", "minimum note ratings", 1)
  .action(async (options: any) => {
    await getEligibleNotes(options.from, options.minimum);
  });

program
  .command("mint-note")
  .description("generate nft data, upload to IPFS and mint for the creator")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rating <number>", "Final rating")
  .action(async (options: any) => {
    await mintNote(options.text, options.url, options.creator, options.rating);
  });

program
  .command("create-x-community-note")
  .description("generate nft data and upload to s3")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Note url")
  .action(async (options: any) => {
    await createXCommunityNoteNFTMetadata(options.text, options.url);
  });

program
  .command("get-ratings")
  .description("get ratings by note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rater <address>", "Note Rater")
  .action(async (options: any) => {
    await getRating(options.url, options.creator, options.rater);
  });

program
  .command("set-sft")
  .description("set factchain NFT contract in factchain SFT")
  .option("-a, --address <address>", "Factchain main contract address")
  .action(async (options: any) => {
    await setNFTContractInSFT(options.address);
  })

program
  .command("get-note-raters")
  .description("get factchain note raters")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Creator Address")
  .action(async (options: any) => {
    await getNoteRaters(options.url, options.creator)
  })

program.parse();
