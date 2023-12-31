import { createSignal } from "solid-js";

export function FCAddress({provider}) {
  const [address, setAddress] = createSignal(null);
  const connect = async () => {
    await provider.getAddress().then(setAddress);
  };

  provider.getAddress().then(setAddress);
  provider.onAddressChange(setAddress);

  return (
    <div>
      {
        address() ?
        <div>
          <div>Account: {address()}</div>
          <button onclick={provider.disconnect}>Disconnect account</button>
        </div>
        : <div>
          <button onclick={connect}>Connect account</button>
        </div>
      }
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

export function FCRateNote({postUrl, creator, content, currentAddress, rateNote}) {
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

export function FCRateNotes({postUrl, notes, rateNote, currentAddress}) {
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
        <FCRateNote postUrl={note.postUrl} creator={note.creator} content={note.content} currentAddress={currentAddress} rateNote={rateNote} />
      }</For>
    </div>
  );
}

export function FCPendingNFTCreation() {
  return (
    <div>
      <FCHero/>
      <div>
        <FCLoader/>
        Creating a new NFT collection for this note!
      </div>
    </div>
  );
}

export function FCLoader() {
  return (
    <span class="loader" style={"width: 30px; height: 30px;"}></span>
  );
}

export function FCHero() {
  return (
    <img
        src="./factchain.jpeg"
        width="300"
        style="position: relative; left: 50%; transform: translateX(-50%); height:70px; object-fit:cover;"
      ></img>
  );
}
