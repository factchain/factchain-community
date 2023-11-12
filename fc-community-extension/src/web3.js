import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream'
import { ethers, utils } from "ethers";
import { METAMASK_ID, FC_CONTRACT_ABI, FC_CONTRACT_ADDRESS } from "./constants";
import abiDecoder from "abi-decoder";

abiDecoder.addABI(FC_CONTRACT_ABI);

export const decodeError = (abiError) => {
  return abiDecoder.decodeMethod(abiError);
}

export const handleContractCallError = (e) => {
  if (e.code === "CALL_EXCEPTION") {
    return abiDecoder.decodeMethod(e.data);
  } else {
    return e;
  }
}

export const createFactCheckProvider = () => {
  try {
    let currentMetaMaskId = METAMASK_ID;
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
    const pluginStream = new PortStream(metamaskPort);
    initializeProvider({
      connectionStream: pluginStream,
    });
    const provider = window.ethereum;
    provider.on('error', (error) => {
      logger.error(`Failed to connect to metamask`, error);
    });
  
    return {
      getAddress: async () => {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        return accounts[0];
      },
      getContract: async () => {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        return new ethers.Contract(
          FC_CONTRACT_ADDRESS,
          FC_CONTRACT_ABI,
          signer,
        );
      },
      onEvents: (topics, callback) => {
        filter = {
          address: FC_CONTRACT_ADDRESS,
          topics: topics.map(utils.id),
        }
        provider.on(filter, callback);
      },
    };
 } catch (e) {
    console.error(`Metamask connect error `, e)
    throw e
  }
}
