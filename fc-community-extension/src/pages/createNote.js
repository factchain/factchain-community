import { render } from "solid-js/web";
import { createSignal, Switch, Match } from "solid-js";
import { createFactchainProvider, makeTransactionCall } from "../utils/web3";
import { logger } from "../utils/logging";
import { cutText } from "../utils/constants";
import { FCHero, FCLoader } from "./components";

export function FCCreateNote({postUrl, createNote}) {
  const [transaction, setTransaction] = createSignal(null);
  const [submitted, setSubmitted] = createSignal(false);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    setSubmitted(true);
    setError(null);
    setTransaction(null);
    const {transaction, error} = await createNote(document.getElementById('content').value);
    setTransaction(transaction);
    setError(error);
    setSubmitted(false);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  const transactionUrl = () => {
    return `https://sepolia.etherscan.io/tx/${transactionHash()}`;
  };

  return (
    <div>
      <FCHero />
      
      <h1>Create New Factchain Note</h1>
      <div>
        <div style="font-size: 120%">Provide additional context for <a href={postUrl}>{cutText(postUrl, 35)}</a></div>
        <div><textarea id="content" disabled={!!transactionHash() || submitted()} rows="10" cols="60" maxlength="500"></textarea></div>
        <Switch>
          <Match when={transactionHash()}>
            <div>
              <a href={transactionUrl()} target="_blank">View transaction {transactionHash()}</a>
            </div>
          </Match>
          <Match when={submitted()}>
            <div>
              <FCLoader />
            </div>
          </Match>
          <Match when={true}>
            <div>
              <button onclick={submit}>Submit Note</button>
            </div>
          </Match>
        </Switch>
      </div>
      { error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
    </div>
  );
}

const provider = await createFactchainProvider();
const address = await provider.requestAddress();
logger.log("Creator address", address);
const postUrl = await chrome.runtime.sendMessage({type: 'fc-get-from-cache', target: "postUrl"});
logger.log("Post URL", postUrl);

const createNote = async (content) => {
  const contract = await provider.getFCContract();
  return await makeTransactionCall(contract, async (c) => await c.createNote(postUrl, content, {value: 100_000}));
}

render(() => <FCCreateNote postUrl={postUrl} createNote={createNote} />, document.getElementById("app"));
