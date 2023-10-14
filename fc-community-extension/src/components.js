import { createSignal } from "solid-js";
import { logger } from "./logging";

export function Popup({provider}) {
  return (
    <div>
      <h1>FactChain</h1>
      <FCAddress provider={provider} />
    </div>
  );
}

export function FCButton() {
  return (
    <div class="r-1nao33i">🚀 FACTCHAIN 🚀</div>
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
    <div class="r-1nao33i">🚀 Account: {address()} 🚀</div>
  );
}