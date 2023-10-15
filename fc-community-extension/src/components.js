import { createSignal } from "solid-js";
import { logger } from "./logging";

export function Popup({provider}) {
  return (
    <div>
      <img
        src="./factchain.jpeg"
        width="300"
        style="height:70px; object-fit:cover;"
      ></img>
      
      <FCAddress provider={provider} />
    </div>
  );
}

export function FCAddress({provider}) {
  const [address, setAddress] = createSignal(null);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      logger.log('Please connect to MetaMask.');
      setAddress("--");
    } else {
      logger.log(`address changed to ${accounts[0]}`);
      setAddress(accounts[0]);
    }
  }

  provider.request({
    method: "eth_requestAccounts",
  }).then(handleAccountsChanged)
  .catch((err) => {
    logger.error(err);
  });

  provider.on('accountsChanged', handleAccountsChanged);

  return (
    <div>
      Account: {address()}
    </div>
  );
}

export function FCCreateNote({postUrl, createNote}) {
  const [transactionHash, setTransactionHash] = createSignal(null);

  const transactionUrl = () => {
    return `https://sepolia.etherscan.io/tx/${transactionHash()}`;
  };

  const submit = async () => {
    const transaction = await createNote(postUrl, document.getElementById('content').value);
    logger.log("Transaction sent", transaction);
    setTransactionHash(transaction.hash);
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
    </div>
  );
}