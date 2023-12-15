import { render } from "solid-js/web";
import { createFactCheckProvider, handleContractCallError } from "../utils/web3";
import { FCRateNotes } from "./components";
import { logger } from "../utils/logging";

const provider = createFactCheckProvider();
const contract = await provider.getFCContract();
const currentAddress = await provider.getAddress();

const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "postUrl"});
logger.log("Post URL", postUrl);
const notes = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "notes"});
logger.log("Notes", notes);

const rateNote = async (postUrl, creator, rating) => {
  logger.log("Rating note", postUrl, creator, rating);
  let transaction = null;
  let error = null;
  try {
    transaction = await contract.rateNote(postUrl, creator, rating, {value: 10_000});
  } catch (e) {
    logger.log("Failed to rate note", e);
    error = handleContractCallError(e);
  }
  return {transaction, error};
};

render(() => <FCRateNotes postUrl={postUrl} notes={notes} rateNote={rateNote} currentAddress={currentAddress} />, document.getElementById("app"));
