#!/usr/bin/env node

import { FactChainBackend } from "../dist/factchain-core/web3.js";
import { NoteService } from "../dist/factchain-core/noteService.js";
import { config } from "../dist/factchain-core/env.js";
import { getNetworkConfig } from "../dist/factchain-core/networks/config.js"

const LOOKBACK_DAYS = parseInt(config.LOOKBACK_DAYS);
const MINIMUM_RATING = parseInt(config.MINIMUM_RATING);

const fc = new FactChainBackend(config, getNetworkConfig("ETHEREUM_SEPOLIA"));
const ns = new NoteService(fc, fc);

const nonces = await fc.getNonces();

const finaliseNotes = async () => {
  // select notes created within the time period and with enough ratings
  const notesToFinalise = await ns.getNotesToFinalise(
    LOOKBACK_DAYS,
    MINIMUM_RATING,
  );
  let nonce = nonces.mainWalletNonce;
  console.log(`Finalise all notes (${notesToFinalise.length}) from ${LOOKBACK_DAYS} days ago  with more than ${MINIMUM_RATING} ratings`);
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
      nonce++,
    );
    console.log(transactionResponse);
  }
  return notesToFinalise;
}

const mintNotes = async () => {
  const notesWithFinalRating = await finaliseNotes();
  let nonce = nonces.nftWalletNonce;
  console.log("Finalisation terminated!");
  for (const note of notesWithFinalRating) {
    const transactionResponse =  await fc.mintNote721(note, nonce++);
    console.log(transactionResponse);
  }
  console.log(`minted ${notesWithFinalRating.length} NFTs`)
};

mintNotes();