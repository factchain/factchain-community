#!/usr/bin/env node

import {
  FactChainEvent,
  getEvents,
  getNote,
  createNote,
  rateNote,
  finaliseNote,
} from "./commands";

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
  .option("-c, --content <text>", "Note content")
  .action(async (pkey: string, options: any) => {
    await createNote(pkey, options.url, options.content);
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

program.parse();