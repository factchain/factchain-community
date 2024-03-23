import { logger } from './logging';
import { initializeProvider } from '@metamask/providers';
import PortStream from 'extension-port-stream';
import { ethers, utils } from 'ethers';
import {
  METAMASK_ID,
  FC_MAIN_CONTRACT_ABI,
  FC_X_CONTRACT_ABI,
  FC_NFT_CONTRACT_ABI,
  FC_SFT_CONTRACT_ABI,
  supportedNetworks,
} from './constants';
import abiDecoder from 'abi-decoder';

abiDecoder.addABI(FC_MAIN_CONTRACT_ABI);
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

export const checkIfMetamaskInstalled = async () => {
  try {
    const currentMetaMaskId = METAMASK_ID;
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
    const pluginStream = new PortStream(metamaskPort);
    initializeProvider({
      connectionStream: pluginStream,
    });
    await window.ethereum.request({
      method: 'wallet_getPermissions',
      params: [],
    });
    metamaskPort.disconnect(currentMetaMaskId);
    console.log('Metamask installed');
    return true;
  } catch (e) {
    return false;
  }
};

export const createFactchainProvider = async (selectedNetwork) => {
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

    if (!selectedNetwork) {
      // First set the selectedNetwork to a default value
      // it might get updated later.
      selectedNetwork = supportedNetworks.ETHEREUM_SEPOLIA;

      // Get the current connected chainId and try to find the
      // corresponding network.
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
        params: [],
      });
      for (let networkName in supportedNetworks) {
        if (supportedNetworks[networkName].chainId === chainId) {
          selectedNetwork = supportedNetworks[networkName];
          break;
        }
      }
    }
    // Finally switch to the selected network, this might be a noop
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: selectedNetwork.chainId,
        },
      ],
    });
    await chrome.runtime.sendMessage({
      type: 'fc-set-network',
      network: selectedNetwork,
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

    const getContractAddress = (contractName) => {
      // mapping contractName to fixed proxy contract
      // doesn't break the upgradeability
      // because proxy should never be upgraded to another addess
      const contractAddress = selectedNetwork.contracts[contractName];
      if (contractAddress) {
        return contractAddress;
      } else {
        throw new Error(`Unknown Contract ${contractName}`);
      }
    };

    const getContract = async (contractName, contractAbi) => {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const contractAddress = getContractAddress(contractName);
      return new ethers.Contract(contractAddress, contractAbi, signer);
    };

    const onContractEvents = async (contractName, topics, callback) => {
      const contractAddress = getContractAddress(contractName);
      filter = {
        address: contractAddress,
        topics: topics.map(utils.id),
      };
      provider.on(filter, callback);
    };

    return {
      selectedNetwork,
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
      getMainContract: async () => getContract('main', FC_MAIN_CONTRACT_ABI),
      onMainEvents: async (topics, callback) =>
        onContractEvents('main', topics, callback),
      getXContract: async () => getContract('x', FC_X_CONTRACT_ABI),
      onXEvents: async (topics, callback) =>
        onContractEvents('x', topics, callback),
      getNftContract: async () => getContract('nft', FC_NFT_CONTRACT_ABI),
      onNftEvents: async (topics, callback) =>
        onContractEvents('nft', topics, callback),
      getSftContract: async () => getContract('sft', FC_SFT_CONTRACT_ABI),
      onSftEvents: async (topics, callback) =>
        onContractEvents('sft', topics, callback),
    };
  } catch (e) {
    console.error(`Metamask connect error `, e);
    throw e;
  }
};

window.makeTransactionCall = makeTransactionCall;
window.createFactchainProvider = createFactchainProvider;
