import { render } from "solid-js/web";
import { createFactCheckProvider, handleContractCallError } from "./web3";
import { FCCreateNote } from "./components";
import { logger } from "./logging";

const provider = createFactCheckProvider();
const address = provider.getAddress();
logger.log("Creator address", address);
const contract = await provider.getFCContract();

const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "postUrl"});
logger.log("Post URL", postUrl);

const createNote = async (postUrl, content) => {
  logger.log("Creating note", postUrl, content);
  let transaction = null;
  let error = null;
  try {
    transaction = await contract.createNote(postUrl, content, {value: 100_000});
  } catch (e) {
    logger.log("Failed to create note", e);
    error = handleContractCallError(e);
  }
  return {transaction, error};
};

render(() => <FCCreateNote postUrl={postUrl} createNote={createNote} />, document.getElementById("app"));
