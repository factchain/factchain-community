import { render } from "solid-js/web";
import { createFactchainProvider, makeTransactionCall } from "../utils/web3";
import { FCRateNotes } from "./components";
import { logger } from "../utils/logging";

const provider = await createFactchainProvider();
const address = await provider.requestAddress();
logger.log("Rater address", address);
const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "postUrl"});
logger.log("Post URL", postUrl);
const notes = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "notes"});
logger.log("Notes", notes);

const rateNote = async (noteCreatorAddress, rating) => {
  const contract = await provider.getFCContract();
  return await makeTransactionCall(contract, async (c) => await c.rateNote(postUrl, noteCreatorAddress, rating, {value: 10_000}));
};


render(() => <FCRateNotes postUrl={postUrl} notes={notes} rateNote={rateNote} currentAddress={address} />, document.getElementById("app"));
