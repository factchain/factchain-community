import { render } from 'solid-js/web';
import { createResource, createSignal, Switch, Match } from 'solid-js';
import {
  createFactchainProvider,
  makeTransactionCall,
  checkIfMetamaskInstalled,
} from '../utils/web3';
import { logger } from '../utils/logging';
import { makeTransactionUrl } from '../utils/constants';
import { FCHero, FCLoaderClean } from './components';

import './style.css';
import { FCMetamaskConnectButton } from './components/FCConnectButton';

export function FCCreateNote({ postUrl, createNote }) {
  const [transaction, setTransaction] = createSignal(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal(null);

  const [isMetamaskInstalled] = createResource(checkIfMetamaskInstalled);

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

      <div className="max-w-[400px] mx-auto px-4 py-3">
        <h1 className="text-2xl font-semibold text-center mb-4">
          {'Create Factchain Note'}
        </h1>
        <div className="space-y-4">
          <div className="truncate w-fulla text-fcAccent">
            <a
              className="link"
              target="_blank"
              rel="noopener noreferrer"
              href={postUrl}
            >
              {postUrl}
            </a>
          </div>
          <div>
            <textarea
              autoFocus
              id="content"
              className="w-full h-[150px] rounded p-4 text-fcGrey"
              placeholder="Add context to this post. Explain the evidence behind your choices and provide links to outside sources."
              disabled={transactionHash() || submitting()}
              maxlength="500"
            />
          </div>
          <Switch>
            <Match when={transactionHash()}>
              <div>
                <div className="py-4 text-center text-xl">
                  {'Your note was successfully submitted!'}
                </div>
                <div className="mt-2 text-center">
                  View transaction on{' '}
                  <a
                    className="link"
                    href={makeTransactionUrl(transactionHash())}
                    target="_blank"
                  >
                    {'etherscan'}
                  </a>
                  .
                </div>
              </div>
              <button
                className="btn p-4 w-full text-lg font-semibold"
                onclick={() => window.close()}
              >
                {'Close'}
              </button>
            </Match>
            <Match when={submitting()}>
              <div className="flex justify-center">
                <FCLoaderClean />
              </div>
            </Match>
            <Match when={true}>
              {error() && (
                <div className="mb-4 bg-red-400/10 text-red-500 font-mono text-base p-4 rounded break-words">
                  Error: {JSON.stringify(error())}
                </div>
              )}
              {!isMetamaskInstalled() && (
                <FCMetamaskConnectButton
                  isMetamaskInstalled={false}
                  connectWallet={() => {}}
                />
              )}
              <button
                className="btn p-4 w-full text-lg font-semibold"
                onclick={submit}
                disabled={!isMetamaskInstalled()}
              >
                {'Submit note'}
              </button>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}

const postUrl = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'postUrl',
});
logger.log('Post URL', postUrl);

const selectedNetwork = await chrome.runtime.sendMessage({
  type: 'fc-get-network',
});

const createNote = async (content) => {
  const provider = await createFactchainProvider(selectedNetwork);
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
