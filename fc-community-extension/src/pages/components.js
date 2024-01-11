import { createSignal } from 'solid-js';

export function FCRateNote({
  postUrl,
  creator,
  content,
  currentAddress,
  rateNote,
}) {
  const [transaction, setTransaction] = createSignal(null);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    const { transaction, error } = await rateNote(
      postUrl,
      creator,
      document.getElementById('rating').value
    );
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
        <div>
          <p>{content}</p>
        </div>
        <div>
          <input
            id="rating"
            type="range"
            min="1"
            step="1"
            max="5"
            disabled={isCreator || !!transactionHash()}
          ></input>
        </div>
        <div>
          <button onclick={submit} disabled={isCreator || !!transactionHash()}>
            Submit
          </button>
        </div>
        {transactionHash() ? (
          <div>
            Transaction: <a href={transactionUrl()}>{transactionHash()}</a>
          </div>
        ) : (
          <div></div>
        )}
        {error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
      </div>
    </li>
  );
}

export function FCRateNotes({ postUrl, notes, rateNote, currentAddress }) {
  return (
    <div>
      <img
        src="./factchain.jpeg"
        width="300"
        style="height:70px; object-fit:cover;"
      ></img>

      <h1>Rate Notes</h1>

      <div>Post URL: {postUrl}</div>
      <For each={notes}>
        {(note) => (
          <FCRateNote
            postUrl={note.postUrl}
            creator={note.creatorAddress}
            content={note.content}
            currentAddress={currentAddress}
            rateNote={rateNote}
          />
        )}
      </For>
    </div>
  );
}

export function FCLoader() {
  return (
    <span
      class="loader"
      style="width: 30px; height: 30px; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);"
    ></span>
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
