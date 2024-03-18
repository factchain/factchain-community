import { render } from 'solid-js/web';
import { createSignal, Switch, Match, createResource } from 'solid-js';
import { makeOpenseaUrl, makeTransactionUrl } from '../utils/constants';
import {
  createFactchainProvider,
  makeTransactionCall,
  checkIfMetamaskInstalled,
} from '../utils/web3';
import { FCHero, FCLoader } from './components';

import './style.css';
import { FCMetamaskConnectButton } from './components/FCConnectButton';

export function FCMintFactchainNote({
  postUrl,
  creatorAddress,
  mintFactchainNote,
}) {
  const [factchainNftId, setFactchainNftId] = createSignal(null);
  const [nftSupply, setNftSupply] = createSignal(null);
  const [transaction, setTransaction] = createSignal(null);
  const [openseaUrl, setOpenseaUrl] = createSignal(null);
  const [error, setError] = createSignal(null);

  const [isMetamaskInstalled] = createResource(checkIfMetamaskInstalled);

  const getFactchainNftInfo = async (postUrl, creatorAddress) => {
    const provider = await createFactchainProvider();
    const nftContract = await provider.getNftContract();
    console.log(`nftContract (${nftContract.target})`, nftContract);
    const sftContract = await provider.getSftContract();

    console.log(`sftContract (${sftContract.target})`, sftContract);
    console.log('Getting factchain note info', postUrl, creatorAddress);
    const id = await nftContract.noteIds(postUrl, creatorAddress);
    const supply = await sftContract.supply(id);
    return { id, supply, sftContract, sftContractAddress: sftContract.target };
  };

  createResource(isMetamaskInstalled, async (isMetamaskInstalled) => {
    if (!isMetamaskInstalled) {
      return;
    }

    try {
      setError(null);
      setTransaction(null);

      const { id, supply, sftContract, sftContractAddress } =
        await getFactchainNftInfo(postUrl, creatorAddress);
      console.log('Retrieved factchainNftId', id);
      setFactchainNftId(id);
      setNftSupply(supply);
      if (!id) {
        setError('No NFT found for this Factchain note :/');
        return;
      }
      setOpenseaUrl(makeOpenseaUrl(sftContractAddress, id));
      console.log('Opensea url set', openseaUrl());
      if (!supply) {
        console.log('No supply left for nft');
        return;
      }

      console.log('Minting factchain note', id);
      const { transaction, error } = await mintFactchainNote(sftContract, id);
      console.log('mintResult', transaction, error);
      setTransaction(transaction);
      if (error) {
        setError(`Transaction failed: ${JSON.stringify(error)}`);
        return;
      }
    } catch (error) {
      setError(`${error}`);
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
              Failed to mint the Factchain note :(
            </div>
            <div style="margin-bottom: 10px; font-size: 110%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              {JSON.stringify(error())}
            </div>
          </Match>
          <Match when={factchainNftId() && !nftSupply() && openseaUrl()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              All NFTs have already been minted for this note.
            </div>
            <div style="margin-bottom: 10px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              Head over to{' '}
              <a className="link" href={openseaUrl()} target="_blank">
                OpenSea
              </a>{' '}
              to buy one for yourself!
            </div>
          </Match>
          <Match when={transaction() && factchainNftId() && openseaUrl()}>
            <div style="margin-bottom: 50px; font-size: 150%; text-align: center; position: relative; top:50%; left: 50%; transform: translate(-50%, -50%);">
              You have successfully collected this Factchain note!
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
          <Match when={factchainNftId()}>
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
              Checking if the note can be minted...
            </div>
            <FCLoader />
          </Match>
        </Switch>
      </div>
    </div>
  );
}

const postUrl = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'postUrl',
});
const creatorAddress = await chrome.runtime.sendMessage({
  type: 'fc-get-from-cache',
  target: 'creatorAddress',
});

const mintFactchainNote = async (sftContract, factchainNoteId) => {
  const value = 1n;
  console.log('Minting Factchain Note');
  const mintPrice = await sftContract.mintPrice();
  return await makeTransactionCall(
    sftContract,
    async (c) =>
      await c.mint(factchainNoteId, value, { value: value * mintPrice })
  );
};

render(
  () => (
    <FCMintFactchainNote
      postUrl={postUrl}
      creatorAddress={creatorAddress}
      mintFactchainNote={mintFactchainNote}
    />
  ),
  document.getElementById('app')
);
