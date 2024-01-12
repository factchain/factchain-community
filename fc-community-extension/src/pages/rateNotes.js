import { render } from "solid-js/web";
import { createFactchainProvider, makeTransactionCall } from "../utils/web3";
import { logger } from "../utils/logging";
import { FCHero } from "./components";
import { createSignal } from "solid-js";

function FCRateNote({creator, content, currentAddress, rateNote}) {
  const [transaction, setTransaction] = createSignal(null);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    const {transaction, error} = await rateNote(creator, document.getElementById('rating').value);
    setTransaction(transaction);
    setError(error);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  const transactionUrl = () => {
    return `https://sepolia.etherscan.io/tx/${transactionHash()}`;
  };

  const isCreator = creator.toLowerCase() === currentAddress.toLowerCase();

  return (
    <li>
      <div>
        <div><p>{content}</p></div>
        <div><input id="rating" type="range" min="1" step="1" max="5" disabled={isCreator || !!transactionHash()}></input></div>
        <div><button onclick={submit} disabled={isCreator || !!transactionHash()}>Submit</button></div>
        { transactionHash() ? <div>Transaction: <a href={transactionUrl()}>{transactionHash()}</a></div> : <div></div>}
        { error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
      </div>
    </li>
  );
}

function FCRateNotes({postUrl, notes, rateNote, currentAddress}) {
  return (
    <div>
     <FCHero></FCHero>
      <h1>Rate Notes</h1>
      <div>Post URL: {postUrl}</div>
      <For each={notes}>{(note) =>
        <FCRateNote creator={note.creatorAddress} content={note.content} currentAddress={currentAddress} rateNote={rateNote} />
      }</For>
    </div>
  )
}

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
