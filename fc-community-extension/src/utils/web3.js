import { logger } from "./logging";
import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream'
import { ethers, utils } from "ethers";
import { METAMASK_ID, FC_CONTRACT_ABI, FC_CONTRACT_ADDRESS, FC_1155_CONTRACT_ABI, FC_1155_CONTRACT_ADDRESS } from "./constants";
import abiDecoder from "abi-decoder";

abiDecoder.addABI(FC_CONTRACT_ABI);
abiDecoder.addABI(FC_1155_CONTRACT_ABI);

export const decodeError = (abiError) => {
  return abiDecoder.decodeMethod(abiError);
}

export const handleContractCallError = (e) => {
  if (e.code === "CALL_EXCEPTION") {
    return decodeError(e.data);
  } else {
    return e;
  }
}

export const createFactCheckProvider = async () => {
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

    await window.ethereum.request({
      "method": "wallet_switchEthereumChain",
      "params": [
        {
          "chainId": "0xAA36A7"
        }
      ]
    });
  
    return {
      getAddress: async () => {
        logger.log("Getting accounts...");
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        logger.log("Received accounts", accounts);
        return accounts[0];
      },
      onAddressChange: (handler) => {
        provider.on("accountsChanged", (accounts) => {
          handler(accounts.length === 0 ? null : accounts[0]);
        });
      },
      disconnect: async () => {
        return provider.request({
          "method": "wallet_revokePermissions",
          "params": [
            {
              "eth_accounts": {}
            }
          ]
        });
      },
      getFCContract: async () => {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        return new ethers.Contract(
          FC_CONTRACT_ADDRESS,
          FC_CONTRACT_ABI,
          signer,
        );
      },
      onFCEvents: (topics, callback) => {
        filter = {
          address: FC_CONTRACT_ADDRESS,
          topics: topics.map(utils.id),
        }
        provider.on(filter, callback);
      },
      getFC1155Contract: async () => {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        return new ethers.Contract(
          FC_1155_CONTRACT_ADDRESS,
          FC_1155_CONTRACT_ABI,
          signer,
        );
      },
      onFC1155Events: (topics, callback) => {
        filter = {
          address: FC_1155_CONTRACT_ADDRESS,
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

export const mintXNote = async (noteId, value, hash, signature) => {
  logger.log("Minting X note", noteId, value, hash, signature);
  const provider = await createFactCheckProvider();
  const contract = await provider.getFC1155Contract();
  let transaction = null;
  let error = null;

  try {
    transaction = await contract.mint(
      noteId,
      value,
      hash.startsWith("0x") ? hash : `0x${hash}`,
      signature,
      {value: value * 1_000_000},
    );
  } catch (e) {
    logger.log("Failed to mint note", e);
    error = handleContractCallError(e);
  }
  return {transaction, error};
};
