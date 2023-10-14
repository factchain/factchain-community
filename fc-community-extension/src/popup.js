import { render } from "solid-js/web";
import { createMetaMaskProvider } from "./provider";
import { Popup } from "./components";
import { logger } from "./logging";

const provider = createMetaMaskProvider();

provider.on('error', (error) => {
  logger.error(`Failed to connect to metamask`, error);
});

render(() => <Popup provider={provider} />, document.getElementById("app"));

// import { EventLog, ethers } from "ethers";

// const RPC_PROVIDER = "https://rpc2.sepolia.org";
// const FC_CONTRACT_ADDRESS = "0x8496863Bd63A611D30020e2825DaDB2FC77DBCe4";
// const abi = [
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_owner",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [],
//     "name": "CantRateOwnNote",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "ContentInvalid",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "FailedToReward",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "FailedToSlash",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "InsufficientStake",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "NotOwner",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "NoteAlreadyExists",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "NoteAlreadyFinalised",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "NoteDoesNotExist",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "PostUrlInvalid",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "RatingAlreadyExists",
//     "type": "error"
//   },
//   {
//     "inputs": [],
//     "name": "RatingInvalid",
//     "type": "error"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "reward",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "CreatorRewarded",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "slash",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "CreatorSlashed",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "NoteCreated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "uint8",
//         "name": "finalRating",
//         "type": "uint8"
//       }
//     ],
//     "name": "NoteFinalised",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "rater",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "uint8",
//         "name": "rating",
//         "type": "uint8"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "NoteRated",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "previousOwner",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "OwnershipTransferred",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "rater",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "reward",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "RaterRewarded",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "rater",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "slash",
//         "type": "uint256"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "stake",
//         "type": "uint256"
//       }
//     ],
//     "name": "RaterSlashed",
//     "type": "event"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "amount",
//         "type": "uint256"
//       }
//     ],
//     "name": "ReserveFunded",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "communityNotes",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "postUrl",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "content",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "creator",
//         "type": "address"
//       },
//       {
//         "internalType": "uint8",
//         "name": "finalRating",
//         "type": "uint8"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "name": "communityRatings",
//     "outputs": [
//       {
//         "internalType": "uint8",
//         "name": "",
//         "type": "uint8"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_postUrl",
//         "type": "string"
//       },
//       {
//         "internalType": "string",
//         "name": "_content",
//         "type": "string"
//       }
//     ],
//     "name": "createNote",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_postUrl",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "_creator",
//         "type": "address"
//       },
//       {
//         "internalType": "uint8",
//         "name": "_finalRating",
//         "type": "uint8"
//       }
//     ],
//     "name": "finaliseNote",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "name": "noteRaters",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "string",
//         "name": "_postUrl",
//         "type": "string"
//       },
//       {
//         "internalType": "address",
//         "name": "_creator",
//         "type": "address"
//       },
//       {
//         "internalType": "uint8",
//         "name": "_rating",
//         "type": "uint8"
//       }
//     ],
//     "name": "rateNote",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "bytes4",
//         "name": "interfaceId",
//         "type": "bytes4"
//       }
//     ],
//     "name": "supportsInterface",
//     "outputs": [
//       {
//         "internalType": "bool",
//         "name": "",
//         "type": "bool"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "_newOwner",
//         "type": "address"
//       }
//     ],
//     "name": "transferOwnership",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "stateMutability": "payable",
//     "type": "receive"
//   }
// ];
// const provider = new ethers.JsonRpcProvider(RPC_PROVIDER);

// const factChainContract = new ethers.Contract(
//   FC_CONTRACT_ADDRESS,
//   abi,
//   provider,
// );

// const owner = await factChainContract.owner();
// const message = document.querySelector('#message');
// message.innerHTML = `owner = ${owner}`;