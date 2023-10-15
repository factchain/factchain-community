import { render } from "solid-js/web";
import { createMetaMaskProvider } from "./provider";
import { Popup } from "./components";
import { logger } from "./logging";

const provider = createMetaMaskProvider();

provider.on('error', (error) => {
  logger.error(`Failed to connect to metamask`, error);
});

render(() => <Popup provider={provider} />, document.getElementById("app"));
