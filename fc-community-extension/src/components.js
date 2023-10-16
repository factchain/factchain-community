import { createSignal } from "solid-js";
import { logger } from "./logging";

export function Popup({provider}) {
  return (
    <div>
      <img
        src="./factchain.jpeg"
        width="300"
        style="height:70px; object-fit:cover;"
      ></img>
      
      <FCAddress provider={provider} />
    </div>
  );
}

export function FCAddress({provider}) {
  const [address, setAddress] = createSignal(null);

  provider.getAddress().then(setAddress);

  return (
    <div>
      Account: {address()}
    </div>
  );
}

export function FCCreateNote({postUrl, createNote}) {
  const [transaction, setTransaction] = createSignal(null);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    const {transaction, error} = await createNote(postUrl, document.getElementById('content').value);
    setTransaction(transaction);
    setError(error);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  const transactionUrl = () => {
    return `https://sepolia.etherscan.io/tx/${transactionHash()}`;
  };

  return (
    <div>
      <img
        src="./factchain.jpeg"
        width="300"
        style="height:70px; object-fit:cover;"
      ></img>
      
      <h1>Create New Note</h1>
      <div>
        <div>Post URL: {postUrl}</div>
        <div><textarea id="content" disabled={!!transactionHash()} rows="10" cols="60" maxlength="500"></textarea></div>
        <div><button onclick={submit} disabled={!!transactionHash()}>Submit</button></div>
      </div>
      { transactionHash() ? <div>Transaction: <a href={transactionUrl()}>{transactionHash()}</a></div> : <div></div>}
      { error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
    </div>
  );
}

export function FCRateNote({postUrl, creator, content, rateNote}) {
  const [transaction, setTransaction] = createSignal(null);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    const {transaction, error} = await rateNote(postUrl, creator, document.getElementById('rating').value);
    setTransaction(transaction);
    setError(error);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  const transactionUrl = () => {
    return `https://sepolia.etherscan.io/tx/${transactionHash()}`;
  };

  return (
    <li>
      <div>
        <div><p>{content}</p></div>
        <div><input id="rating" type="range" min="1" step="1" max="5" disabled={!!transactionHash()}></input></div>
        <div><button onclick={submit} disabled={!!transactionHash()}>Submit</button></div>
        { transactionHash() ? <div>Transaction: <a href={transactionUrl()}>{transactionHash()}</a></div> : <div></div>}
        { error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
      </div>
    </li>
  );
}

export function FCRateNotes({postUrl, notes, rateNote}) {
  return (
    <div>
      <img
        src="./factchain.jpeg"
        width="300"
        style="height:70px; object-fit:cover;"
      ></img>
      
      <h1>Rate Notes</h1>

      <div>Post URL: {postUrl}</div>
      <For each={notes}>{(note) =>
        <FCRateNote postUrl={note.postUrl} creator={note.creator} content={note.content} rateNote={rateNote} />
      }</For>
    </div>
  );
}