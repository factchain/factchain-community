import { render } from "solid-js/web";
import { createSignal, Switch, Match, createResource } from "solid-js";
import { getXNoteId, createXNoteId } from "../utils/backend";
import { makeOpenseaUrl, makeTransactionUrl } from "../utils/constants";
import { createFactchainProvider, makeTransactionCall } from "../utils/web3";
import { FCHero, FCLoader } from "./components";

export function FCMintXNote({ noteUrl, content, mintXNote, contractAddress }) {
  const [xNoteId, setXNoteId] = createSignal(null);
  const [transaction, setTransaction] = createSignal(null);
  const [error, setError] = createSignal(null);
  createResource(async () => {
    try {
      let res = await getXNoteId(noteUrl);
      if (!res) {
        res = await createXNoteId(noteUrl, content);
      }
      console.log("Retrieved xNoteId", res);
      setXNoteId(res);

      setError(null);
      setTransaction(null);
      const {transaction, error} = await mintXNote(res);
      console.log("mintResult", transaction, error);
      setTransaction(transaction);
      setError(error);
    } catch (error) {
      setError(error);
    }
  });
  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  return (
    <div>
      <FCHero/>

      <div style="margin-top: 50px;">
        <Switch>
          <Match when={error()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Failed to create the NFT collection
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              {JSON.stringify(error())}
            </div>
          </Match>
          <Match when={transaction() && xNoteId()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              NFT minted successfully!
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              <a href={makeTransactionUrl(transactionHash())} target="_blank">View transaction {transactionHash()}</a>
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              <a href={makeOpenseaUrl(contractAddress, xNoteId().id)} target="_blank">View NFT on OpenSea</a>
            </div>
          </Match>
          <Match when={xNoteId()}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Approve the transaction to mint your NFT.
            </div>
            <FCLoader />
          </Match>
          <Match when={true}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Creating a new NFT collection for this note...
            </div>
            <FCLoader />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

const noteUrl = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "noteUrl"});
const content = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "content"});
const provider = await createFactchainProvider();
const contract = await provider.getFC1155Contract();
console.log(`contract`, contract);
console.log(`contract address ${contract.target}`);

const mintXNote = async (xNoteId) => {
  const value = 1;
  console.log("Minting X Note");
  return await makeTransactionCall(
    contract,
    async (c) => await c.mint(
      xNoteId.id,
      value,
      xNoteId.hash.startsWith("0x") ? xNoteId.hash : `0x${xNoteId.hash}`,
      xNoteId.signature,
      {value: value * 1_000_000},
    )
  );
};

render(() => <FCMintXNote noteUrl={noteUrl} content={content} mintXNote={mintXNote} contractAddress={contract.target} />, document.getElementById("app"));
