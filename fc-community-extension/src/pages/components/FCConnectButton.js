function FCConnectButton(props) {
  // { walletName, disabled, isInstalled, connectWallet, installWallet }) {
  return (
    <button
      className="w-full p-4 font-semibold text-base btn"
      onclick={() =>
        props.isInstalled ? props.connectWallet() : props.installWallet()
      }
      disabled={props.disabled}
    >
      <div className="flex place-content-evenly">
        <img
          src={`/logos/${props.walletName}.png`}
          alt={`${props.walletName} Logo`}
          className="w-[25px] h-[25px]"
        />
        {props.isInstalled ? (
          <span>Connect with {props.walletName}</span>
        ) : (
          <span>Install {props.walletName}</span>
        )}
      </div>
    </button>
  );
}

export function FCMetamaskConnectButton(props) {
  return (
    <FCConnectButton
      walletName="Metamask"
      disabled={false}
      isInstalled={props.isInstalled}
      connectWallet={props.connectWallet}
      installWallet={() =>
        window.open('https://metamask.io/download.html', '_blank')
      }
    />
  );
}

export function FCRabbyConnectButton(props) {
  return (
    <FCConnectButton
      walletName="Rabby"
      disabled={true}
      isInstalled={false}
      connectWallet={props.connectWallet}
      installWallet={() => window.open('https://rabby.io/', '_blank')}
    />
  );
}
