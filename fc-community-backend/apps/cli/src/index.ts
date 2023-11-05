#!/usr/bin/env node

import {
  getEvents,
  getNote,
  createNote,
  rateNote,
  finaliseNote,
  getEligibleNotes,
  generateNoteNFT,
  mintNote,
} from "./commands";

import { FactChainEvent } from "./factchain-core/types";

const { Command } = require("commander");
const figlet = require("figlet");

const program = new Command();

console.log(figlet.textSync("FactChain"));

program.version("1.0.0").description("FactChain command line");

program
  .command("events <eventType>")
  .description("Get a list of events")
  .option("-f, --from <number>", "Start block", parseInt, 0)
  .option("-t, --to <number>", "End block", parseInt)
  .action(async (eventType: FactChainEvent, options: any) => {
    await getEvents(eventType, options.from, options.to);
  });

program
  .command("get-note")
  .description("Get a community note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Creator address")
  .action(async (options: any) => {
    await getNote(options.url, options.creator);
  });

program
  .command("create-note <pkey>")
  .description("create a community note")
  .option("-u, --url <url>", "Post url")
  .option("-t, --text <text>", "Note content")
  .action(async (pkey: string, options: any) => {
    await createNote(pkey, options.url, options.text);
  });

program
  .command("rate-note <pkey>")
  .description("rate a community note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rating <number>", "Note Rating", parseInt, 0)
  .action(async (pkey: string, options: any) => {
    await rateNote(pkey, options.url, options.creator, options.rating);
  });

program
  .command("finalise-note")
  .description("set the note final rating")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rating <number>", "Note Rating", parseInt, 0)
  .action(async (options: any) => {
    await finaliseNote(options.url, options.creator, options.rating);
  });

program
  .command("get-eligible-notes")
  .description("get notes ready to be finalised")
  .option("-n, --minimum <number>", "minimum note ratings", 1)
  .option("-f, --from <number>", "Start date")
  .option("-t, --to <number>", "End date")
  .action(async (options: any) => {
    await getEligibleNotes(options.from, options.to, options.minimum);
  });

program
  .command("generate-note-nft")
  .description("generate note nft data and upload to IPFS")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .action(async (options: any) => {
    await generateNoteNFT(options.text, options.url, options.creator);
  });

program
  .command("mint-note <pkey>")
  .description("generate note nft data and upload to IPFS")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .action(async (pkey: string, options: any) => {
    await mintNote(pkey, options.text, options.url, options.creator);
  });

program.parse();
