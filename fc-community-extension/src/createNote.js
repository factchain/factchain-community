import { render } from "solid-js/web";
import { createFactCheckProvider } from "./provider";
import { FCCreateNote } from "./components";
import { logger } from "./logging";

const provider = createFactCheckProvider();
const address = provider.getAddress();
logger.log("Creator address", address);
const contract = await provider.getContract();

const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-post-url'});
logger.log("Post URL", postUrl);

const createNote = async (postUrl, content) => {
  return await contract.createNote(postUrl, content, {value: 100_000});
};

render(() => <FCCreateNote postUrl={postUrl} createNote={createNote} />, document.getElementById("app"));
