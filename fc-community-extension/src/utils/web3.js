import { logger } from "./logging";
import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream'
import { ethers, utils } from "ethers";
import { METAMASK_ID, FC_CONTRACT_ABI, FC_1155_CONTRACT_ABI } from "./constants";
import { getContracts } from "./backend";
import abiDecoder from "abi-decoder";

abiDecoder.addABI(FC_CONTRACT_ABI);
abiDecoder.addABI(FC_1155_CONTRACT_ABI);

export const decodeError = (abiError) => {
  return abiDecoder.decodeMethod(abiError);
};

export const handleContractCallError = (e) => {
  if (e.code === "CALL_EXCEPTION") {
    return decodeError(e.data);
  } else {
    return e;
  }
};

export const makeTransactionCall = async (contract, transactionCall) => {
  let transaction = null;
  let error = null;
  try {
    transaction = await transactionCall(contract);
  } catch (e) {
    logger.log("Transaction failed", e);
    error = handleContractCallError(e);
  }
  return {transaction, error};
};

export const createFactchainProvider = async () => {
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
        logger.log("Getting accounts");
        const accounts = await provider.request({method: "eth_accounts"});
        logger.log("Received accounts", accounts);
        return accounts[0];
      },
      requestAddress: async () => {
        logger.log("Requesting access to accounts");
        const accounts = await provider.request({method: "eth_requestAccounts"});
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
        const fcContractAddress = (await getContracts()).main;
        return new ethers.Contract(
          fcContractAddress,
          FC_CONTRACT_ABI,
          signer,
        );
      },
      onFCEvents: async (topics, callback) => {
        const fcContractAddress = (await getContracts()).main;
        filter = {
          address: fcContractAddress,
          topics: topics.map(utils.id),
        }
        provider.on(filter, callback);
      },
      getFC1155Contract: async () => {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const fc1155ContractAddress = (await getContracts()).nft1155;
        return new ethers.Contract(
          fc1155ContractAddress,
          FC_1155_CONTRACT_ABI,
          signer,
        );
      },
      onFC1155Events: async (topics, callback) => {
        const fc1155ContractAddress = (await getContracts()).nft1155;
        filter = {
          address: fc1155ContractAddress,
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
  const provider = await createFactchainProvider();
  const contract = await provider.getFC1155Contract();

  return await makeTransactionCall(contract, async (c) => await c.mint(
    noteId,
    value,
    hash.startsWith("0x") ? hash : `0x${hash}`,
    signature,
    {value: value * 1_000_000},
  ));
};
