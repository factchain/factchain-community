import { render } from 'solid-js/web';
import { createFactchainProvider, makeTransactionCall } from '../utils/web3';
import { logger } from '../utils/logging';
import { FCHero, FCLoader } from './components';
import { createSignal } from 'solid-js';
import { makeTransactionUrl } from '../utils/constants';

import './style.css';

function FCRateNote({ note, rateNote }) {
  const [transaction, setTransaction] = createSignal(null);
  const [submitting, setSubmitting] = createSignal(false);
  const [rating, setRating] = createSignal(null);
  const [error, setError] = createSignal(null);

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

  return (
    <div>
      <FCHero />

      <h1>Rate Factchain Note</h1>
      <div>
        <div>
          <div style="font-size: 120%">
            Rate the level of helpfulness of this note:
          </div>
          <p style="margin: 30px;">{note.content}</p>
          <div>
            <input
              id="rating"
              type="range"
              min="1"
              step="1"
              max="5"
              disabled={transactionHash() || submitting()}
            ></input>
          </div>
        </div>

        <Switch>
          <Match when={transactionHash()}>
            <div>
              <div style="margin-top: 50px; margin-bottom: 20px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
                Your rating of {rating()}/5 was successfully submitted!
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
              <button onclick={submit}>Submit rating</button>
            </div>
          </Match>
        </Switch>
      </div>
      {error() ? <div>Error: {JSON.stringify(error())}</div> : <div></div>}
    </div>
  );
}

const note = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'note',
});
logger.log('Note to rate', note);

const rateNote = async (note, rating) => {
  const provider = await createFactchainProvider();
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
