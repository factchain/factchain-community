import { render } from 'solid-js/web';
import { createSignal, Switch, Match, createResource } from 'solid-js';
import { getXNoteId, createXNoteId, awaitOpenSeaUrl } from '../utils/backend';
import { makeOpenseaUrl, makeTransactionUrl } from '../utils/constants';
import {
  createFactchainProvider,
  makeTransactionCall,
  checkIfMetamaskInstalled,
} from '../utils/web3';
import { FCHero, FCLoader } from './components';

import './style.css';
import { FCMetamaskConnectButton } from './components/FCConnectButton';

export function FCMintXNote({ noteUrl, content, mintXNote }) {
  const [xNoteId, setXNoteId] = createSignal(null);
  const [transaction, setTransaction] = createSignal(null);
  const [openseaUrl, setOpenseaUrl] = createSignal(null);
  const [error, setError] = createSignal(null);

  const [isMetamaskInstalled] = createResource(checkIfMetamaskInstalled);

  createResource(isMetamaskInstalled, async (isMetamaskInstalled) => {
    if (!isMetamaskInstalled) {
      return;
    }

    try {
      setError(null);
      setTransaction(null);

      const selectedNetwork = await chrome.runtime.sendMessage({
        type: 'fc-get-network',
      });
      const provider = await createFactchainProvider(selectedNetwork);
      const contract = await provider.getXContract();
      console.log(`contract`, contract);
      console.log(`contract address ${contract.target}`);

      let res = await getXNoteId(noteUrl);
      if (!res) {
        res = await createXNoteId(noteUrl, content);
      }
      console.log('Retrieved xNoteId', res);
      setXNoteId(res);

      const { transaction, error } = await mintXNote(res, contract);
      console.log('mintResult', transaction, error);
      setTransaction(transaction);
      if (error) {
        throw new Error(`Transaction failed: ${JSON.stringify(error)}`);
      }

      const url = makeOpenseaUrl(contract.target, xNoteId().id);
      const openseaRes = await awaitOpenSeaUrl(url);
      console.log('awaitOpenSeaUrl result: ', openseaRes);
      setOpenseaUrl(url);
    } catch (error) {
      setError(error);
    }
  });
  const transactionHash = () => {
    return transaction() ? transaction().hash : null;
  };

  return (
    <div>
      <FCHero />

      <div style="margin-top: 50px;">
        <Switch>
          <Match when={error()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Failed to create a collection for this note :(
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              {JSON.stringify(error())}
            </div>
          </Match>
          <Match when={transaction() && xNoteId() && openseaUrl()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              You have successfully collected this note!
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Check it out on{' '}
              <a className="link" href={openseaUrl()} target="_blank">
                OpenSea
              </a>
              .
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
          </Match>
          <Match when={transaction() && xNoteId()}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Transaction sent, awaiting confirmation...
            </div>
            <FCLoader />
          </Match>
          <Match when={xNoteId()}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Approve the transaction in Metamask to collect the note.
            </div>
            <FCLoader />
          </Match>
          <Match when={!isMetamaskInstalled()}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Metamask is required to collect the note.
            </div>
            <FCMetamaskConnectButton
              isMetamaskInstalled={false}
              connectWallet={() => {}}
            />
          </Match>
          <Match when={true}>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Creating a new collection for this note...
            </div>
            <FCLoader />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

const noteUrl = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'noteUrl',
});
const content = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'content',
});

const mintXNote = async (xNoteId, contract) => {
  const value = 1n;
  console.log('Minting X Note');
  const mintPrice = await contract.mintPrice();
  return await makeTransactionCall(
    contract,
    async (c) =>
      await c.mint(
        xNoteId.id,
        value,
        xNoteId.hash.startsWith('0x') ? xNoteId.hash : `0x${xNoteId.hash}`,
        xNoteId.signature,
        { value: value * mintPrice }
      )
  );
};

render(
  () => (
    <FCMintXNote noteUrl={noteUrl} content={content} mintXNote={mintXNote} />
  ),
  document.getElementById('app')
);
