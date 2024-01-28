import { logger } from './logging';
import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream';
import { ethers, utils } from 'ethers';
import {
  METAMASK_ID,
  FC_CONTRACT_ABI,
  FC_X_CONTRACT_ABI,
} from './constants';
import { getContracts } from './backend';
import abiDecoder from 'abi-decoder';

abiDecoder.addABI(FC_CONTRACT_ABI);
abiDecoder.addABI(FC_X_CONTRACT_ABI);

export const decodeError = (abiError) => {
  return abiDecoder.decodeMethod(abiError);
};

export const handleContractCallError = (e) => {
  if (e.code === 'CALL_EXCEPTION') {
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
    logger.log('Transaction failed', e);
    error = handleContractCallError(e);
  }
  return { transaction, error };
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
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0xAA36A7',
        },
      ],
    });

    const getAccounts = async (requestAccess) => {
      logger.log(`Get accounts, requestAccess=${requestAccess}`);
      const method = requestAccess ? 'eth_requestAccounts' : 'eth_accounts';
      const accounts = await provider.request({ method });
      logger.log('Received accounts', accounts);
      await chrome.runtime.sendMessage({
        type: 'fc-set-address',
        address: accounts[0],
      });
      return accounts;
    };
    const getContract = async (contractName, contractAbi) => {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = (await getContracts())[contractName];
      return new ethers.Contract(contractAddress, contractAbi, signer);
    };
    const onContractEvents = async (contractName, topics, callback) => {
      const contractAddress = (await getContracts())[contractName];
      filter = {
        address: contractAddress,
        topics: topics.map(utils.id),
      };
      provider.on(filter, callback);
    };

    return {
      getAddresses: async () => await getAccounts(false),
      getAddress: async () => (await getAccounts(false))[0],
      requestAddress: async () => (await getAccounts(true))[0],
      disconnect: async () => {
        return provider.request({
          method: 'wallet_revokePermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
      },
      getFCContract: async () => getContract('main', FC_CONTRACT_ABI),
      onFCEvents: async (topics, callback) =>
        onContractEvents('main', topics, callback),
      getFC1155Contract: async () =>
        getContract('x', FC_X_CONTRACT_ABI),
      onFC1155Events: async (topics, callback) =>
        onContractEvents('x', topics, callback),
    };
  } catch (e) {
    console.error(`Metamask connect error `, e);
    throw e;
  }
};
