import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream'

const METAMASK_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn";

export function createMetaMaskProvider() {
  try {
    let currentMetaMaskId = METAMASK_ID;
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
    const pluginStream = new PortStream(metamaskPort);
    initializeProvider({
      connectionStream: pluginStream,
    });
    return window.ethereum;
 } catch (e) {
    console.error(`Metamask connect error `, e)
    throw e
  }
}