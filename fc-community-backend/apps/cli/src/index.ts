#!/usr/bin/env node

import {
  getEvents,
  getNote,
  getNotes,
  createNote,
  rateNote,
  finaliseNote,
  getEligibleNotes,
  mintNote,
  createXCommunityNoteNFTMetadata,
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
  .description("Get a factchain note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Creator address")
  .action(async (options: any) => {
    await getNote(options.url, options.creator);
  });

program
  .command("get-notes")
  .description("Get factchain notes for a given post")
  .option("-u, --url <url>", "Post url")
  .action(async (options: any) => {
    await getNotes(options.url);
  });


program
  .command("create-note")
  .description("create a community note")
  .option("-u, --url <url>", "Post url")
  .option("-t, --text <text>", "Note content")
  .action(async (options: any) => {
    await createNote(options.url, options.text);
  });

program
  .command("rate-note")
  .description("rate a community note")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .option("-r, --rating <number>", "Note Rating", parseInt, 0)
  .action(async (options: any) => {
    await rateNote(options.url, options.creator, options.rating);
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
  .command("mint-note")
  .description("generate nft data, upload to IPFS and mint for the creator")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Post url")
  .option("-c, --creator <address>", "Note creator")
  .action(async (options: any) => {
    await mintNote(options.text, options.url, options.creator);
  });

program
  .command("create-x-community-note")
  .description("generate nft data and upload to s3")
  .option("-t, --text <text>", "Note content")
  .option("-u, --url <url>", "Note url")
  .action(async (options: any) => {
    await createXCommunityNoteNFTMetadata(options.text, options.url);
  });

program.parse();
