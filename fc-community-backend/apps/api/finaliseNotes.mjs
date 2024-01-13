#!/usr/bin/env node

import { FactChainBackend } from "../src/factchain-core/web3";
import { NoteService } from "../src/factchain-core/noteService";
import { config } from "../src/factchain-core/env";

const LOOKBACK_DAYS = 2
const MINIMUM_RATING = 1
  
const finaliseNotes = async (
    from,
    minimumRatingsPerNote,
  ) => {
    const fc = new FactChainBackend(config);
    const ns = new NoteService(fc, fc);
    // select notes created within the time period and with enough ratings
    const notesToFinalise = await ns.getNotesToFinalise(
      from,
      minimumRatingsPerNote,
    );
    let responses = [];
    for (const note of notesToFinalise) {
      console.log(
        `finalising note on ${note.postUrl} created by ${note.creatorAddress}`,
      );
      const [finalRating, finaliseTransactionResponse] =
        await finaliseNoteHelper(note);
      responses.push(finaliseTransactionResponse);
      const mintTransactionResponse = await mintNote(
        note.content,
        note.postUrl,
        note.creatorAddress,
        finalRating,
      );
      responses.push(mintTransactionResponse);
    }
    console.log(responses);
    console.log(`minted ${notesToFinalise.length} NFTs`);
    return responses;
  };

const finaliseNoteHelper = async (
    note,
  ) => {
    const fc = new FactChainBackend(config);
    // Rocket Science factchain scoring algorithm!
    // Half Round Down Average
    const finalRating = ~~(
      note.ratings.reduce((a, b) => a + Number(b), 0) / note.ratings.length
    );
    console.log(
      `Final Rating of note on ${note.postUrl} created by ${note.creatorAddress} is ${finalRating}`,
    );
    const transactionResponse = await fc.finaliseNote(
      note.postUrl,
      note.creatorAddress,
      finalRating,
    );
    return [finalRating, transactionResponse];
  };

const mintNote = async (
    text,
    postUrl,
    creator,
    finalRating,
  ) => {
    const fc = new FactChainBackend(config);
    return await fc.mintNote721({
      postUrl,
      creatorAddress: creator,
      content: text,
      finalRating,
    });
  };

finaliseNotes(LOOKBACK_DAYS, MINIMUM_RATING);