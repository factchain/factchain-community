import { render } from 'solid-js/web';
import { createSignal, Switch, Match } from 'solid-js';
import { createFactchainProvider, makeTransactionCall } from '../utils/web3';
import { logger } from '../utils/logging';
import { cutText, makeTransactionUrl } from '../utils/constants';
import { FCHero, FCLoader } from './components';

import './style.css';

export function FCCreateNote({ postUrl, createNote }) {
  const [transaction, setTransaction] = createSignal(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal(null);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setTransaction(null);
    const { transaction, error } = await createNote(
      document.getElementById('content').value
    );
    setTransaction(transaction);
    setError(error);
    setSubmitting(false);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  return (
    <div>
      <FCHero />

      <h1>Create New Factchain Note</h1>
      <div>
        <div style="font-size: 120%">
          Provide additional context for{' '}
          <a className="link" href={postUrl}>
            {cutText(postUrl, 35)}
          </a>
        </div>
        <div>
          <textarea
            id="content"
            disabled={transactionHash() || submitting()}
            rows="10"
            cols="60"
            maxlength="500"
          ></textarea>
        </div>
        <Switch>
          <Match when={transactionHash()}>
            <div>
              <div style="margin-top: 50px; margin-bottom: 20px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
                Your note was successfully submitted!
              </div>
              <div style="margin-bottom: 10px; font-size: 90%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
                View transaction on{' '}
                <a
                  className="link"
                  href={makeTransactionUrl(transactionHash())}
                  target="_blank"
                >
                  etherscan
                </a>
                .
              </div>
            </div>
          </Match>
          <Match when={submitting()}>
            <div>
              <FCLoader />
            </div>
          </Match>
          <Match when={true}>
            <div>
              <button onclick={submit}>Submit note</button>
            </div>
          </Match>
        </Switch>
      </div>
      {error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
    </div>
  );
}

const postUrl = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'postUrl',
});
logger.log('Post URL', postUrl);

const createNote = async (content) => {
  const provider = await createFactchainProvider();
  const address = await provider.requestAddress();
  logger.log('Creator address', address);
  const contract = await provider.getMainContract();
  const minimumStakePerNote = await contract.minimumStakePerNote();
  return await makeTransactionCall(
    contract,
    async (c) =>
      await c.createNote(postUrl, content, { value: minimumStakePerNote })
  );
};

render(
  () => <FCCreateNote postUrl={postUrl} createNote={createNote} />,
  document.getElementById('app')
);
