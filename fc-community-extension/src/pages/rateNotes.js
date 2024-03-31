import { render } from 'solid-js/web';
import {
  createFactchainProvider,
  makeTransactionCall,
  checkIfMetamaskInstalled,
} from '../utils/web3';
import { logger } from '../utils/logging';
import { FCHero, FCLoaderClean } from './components';
import FCNote from './components/FCNote';
import { createSignal, createResource } from 'solid-js';
import { makeTransactionUrl } from '../utils/constants';
import { FCMetamaskConnectButton } from './components/FCConnectButton';

import './style.css';

const note = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'note',
});
logger.log('Note to rate', note);

const selectedNetwork = await chrome.runtime.sendMessage({
  type: 'fc-get-network',
});

function FCRateNote({ note, rateNote }) {
  const [transaction, setTransaction] = createSignal(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [rating, setRating] = createSignal(3);
  const [error, setError] = createSignal(null);

  const [isMetamaskInstalled] = createResource(checkIfMetamaskInstalled);

  const submit = async () => {
    const rating = document.getElementById('rating').value;
    setRating(rating);
    setSubmitting(true);
    setError(null);
    setTransaction(null);
    const { transaction, error } = await rateNote(note, rating);
    setTransaction(transaction);
    setError(error);
    setSubmitting(false);
  };

  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  const handleChange = (e) => {
    setRating(Number(e.target.value));
  };

  return (
    <div>
      <FCHero />
      <div className="max-w-[400px] mx-auto px-4 py-3">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Rate Factchain Note
        </h1>
        <div className="mb-8">
          <FCNote
            key={note.postUrl}
            postUrl={note.postUrl}
            creator={note.creatorAddress}
            content={note.content}
            hideMetas
          />
        </div>
        {!transactionHash() && (
          <div>
            <div className="text-base">
              {'How helpful is this note? Rate it on a scale of 1 to 5.'}
            </div>
            <div className="px-8 my-8 flex items-center gap-4">
              <input
                className="flex-grow accent-fcAccent outline-none"
                id="rating"
                type="range"
                min="1"
                step="1"
                max="5"
                disabled={transactionHash() || submitting()}
                onChange={handleChange}
                value={rating()}
              />
              <div className="text-base bg-fcAccent/10 text-fcAccent font-bold rounded-full w-8 h-8 flex items-center justify-center">
                {rating()}
              </div>
            </div>
          </div>
        )}

        <Switch>
          <Match when={transactionHash()}>
            <div className="flex flex-col items-center text-center">
              <img
                className="w-[70px] h-[70px]"
                src="/ui/icons/checkbox-checked.png"
              />
              <div className="text-base mt-4">
                {`You gave this note a ${rating()}/5 rating.`}
              </div>
              <div className="mt-2">
                View transaction on{' '}
                <a
                  className="link"
                  href={makeTransactionUrl(
                    selectedNetwork.explorerUrl,
                    transactionHash()
                  )}
                  target="_blank"
                >
                  {selectedNetwork.explorerDisplayName}
                </a>
                .
              </div>
              <button
                className="btn p-4 w-full text-lg font-semibold mt-4"
                onclick={() => window.close()}
              >
                {'Close'}
              </button>
            </div>
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
              Submit rating
            </button>
          </Match>
        </Switch>
      </div>
    </div>
  );
}

const rateNote = async (note, rating) => {
  const provider = await createFactchainProvider(selectedNetwork);
  const address = await provider.requestAddress();
  logger.log(
    `Address ${address} rating note ${note.postUrl}-${note.creatorAddress} as ${rating}/5`
  );

  const contract = await provider.getMainContract();
  const minimumStakePerRating = await contract.minimumStakePerRating();
  return await makeTransactionCall(
    contract,
    async (c) =>
      await c.rateNote(note.postUrl, note.creatorAddress, rating, {
        value: minimumStakePerRating,
      })
  );
};

render(
  () => <FCRateNote note={note} rateNote={rateNote} />,
  document.getElementById('app')
);
