import { render } from "solid-js/web";
import { createFactCheckProvider } from "./provider";
import { FCRateNotes } from "./components";
import { logger } from "./logging";

const provider = createFactCheckProvider();
const contract = await provider.getContract();

const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-post-url'});
logger.log("Post URL", postUrl);
const notes = await chrome.runtime.sendMessage({type: 'fc-get-notes', postUrl});
logger.log("Notes", notes);

const rateNote = async (postUrl, creator, rating) => {
  return await contract.rateNote(postUrl, creator, rating, {value: 10_000});
};

render(() => <FCRateNotes postUrl={postUrl} notes={notes} rateNote={rateNote} />, document.getElementById("app"));
