#!/usr/bin/env node

import { FactChainBackend } from "../dist/factchain-core/web3.js";
import { NoteService } from "../dist/factchain-core/noteService.js";
import { config } from "../dist/factchain-core/env.js";

const LOOKBACK_DAYS = parseInt(process.argv[2]) || 2;
const MINIMUM_RATING = parseInt(process.argv[3]) || 1;

console.log(`Finalise all notes from ${LOOKBACK_DAYS} days ago with more than ${MINIMUM_RATING} ratings`)

const fc = new FactChainBackend(config);
const ns = new NoteService(fc, fc);

const finaliseNotes = async () => {
  // select notes created within the time period and with enough ratings
  const notesToFinalise = await ns.getNotesToFinalise(
    LOOKBACK_DAYS,
    MINIMUM_RATING,
  );
  for (const note of notesToFinalise) {
    console.log(
      `finalising note on ${note.postUrl} created by ${note.creatorAddress}`,
    );
    note.finalRating = ~~(
      note.ratings.reduce((a, b) => a + Number(b), 0) / note.ratings.length
    );
    const transactionResponse = await fc.finaliseNote(
      note.postUrl,
      note.creatorAddress,
      note.finalRating,
    );
    console.log(transactionResponse);
  }
  return notesToFinalise;
}

const mintNotes = async () => {
  const notesWithFinalRating = await finaliseNotes();
  for (const note of notesWithFinalRating) {
    const transactionResponse =  await fc.mintNote721(note);
    console.log(transactionResponse);
  }
  console.log(`minted ${notesWithFinalRating.length} NFTs`)
};

mintNotes();