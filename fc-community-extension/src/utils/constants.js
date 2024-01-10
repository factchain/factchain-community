export const METAMASK_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn";
export const POST_URL_REGEX = /^(https:\/\/(twitter|x).com\/.+?\/status\/\d+).*$/;
export const NOTE_URL_REGEX = /^(https:\/\/(twitter|x).com\/.+?\/birdwatch\/.+?\/\d+).*$/;
/*
- `^` to only match the start of the string
- Then we match `http` and `https` alike
- Finally we use `$1` to keep the `http(s)` we found and thus replace `twitter.com` by `x.com`
*/
export const sanitizeXUrl = (url) => url ? url.replace(/^(http(s)?):\/\/twitter.com/, "$1://x.com") : url;
export const parseUrl = (url, regex) => sanitizeXUrl(url.match(regex)[1]);
export const cutText = (text, maxLength) => {
    return text.length < maxLength ? text : `${text.slice(0, maxLength)}...`;
};

export const FC_CONTRACT_ABI = [
  {
      "type": "constructor",
      "inputs": [
          {
              "name": "_owner",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "nonpayable"
  },
  {
      "type": "receive",
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "communityNotes",
      "inputs": [
          {
              "name": "",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "postUrl",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "content",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "finalRating",
              "type": "uint8",
              "internalType": "uint8"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "communityRatings",
      "inputs": [
          {
              "name": "",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint8",
              "internalType": "uint8"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "createNote",
      "inputs": [
          {
              "name": "_postUrl",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "_content",
              "type": "string",
              "internalType": "string"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "finaliseNote",
      "inputs": [
          {
              "name": "_postUrl",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "_creator",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "_finalRating",
              "type": "uint8",
              "internalType": "uint8"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "noteRaters",
      "inputs": [
          {
              "name": "",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "rateNote",
      "inputs": [
          {
              "name": "_postUrl",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "_creator",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "_rating",
              "type": "uint8",
              "internalType": "uint8"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
          {
              "name": "interfaceId",
              "type": "bytes4",
              "internalType": "bytes4"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
          {
              "name": "_newOwner",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "userStats",
      "inputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "numberNotes",
              "type": "uint32",
              "internalType": "uint32"
          },
          {
              "name": "numberRatings",
              "type": "uint32",
              "internalType": "uint32"
          },
          {
              "name": "ethRewarded",
              "type": "uint96",
              "internalType": "uint96"
          },
          {
              "name": "ethSlashed",
              "type": "uint96",
              "internalType": "uint96"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "event",
      "name": "CreatorRewarded",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "reward",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "CreatorSlashed",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "slash",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NoteCreated",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NoteFinalised",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "finalRating",
              "type": "uint8",
              "indexed": true,
              "internalType": "uint8"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NoteRated",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "rater",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "rating",
              "type": "uint8",
              "indexed": true,
              "internalType": "uint8"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
          {
              "name": "previousOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "newOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "RaterRewarded",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "rater",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "reward",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "RaterSlashed",
      "inputs": [
          {
              "name": "postUrl",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "creator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "rater",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "slash",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "stake",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "ReserveFunded",
      "inputs": [
          {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "error",
      "name": "CantRateOwnNote",
      "inputs": []
  },
  {
      "type": "error",
      "name": "ContentInvalid",
      "inputs": []
  },
  {
      "type": "error",
      "name": "FailedToReward",
      "inputs": []
  },
  {
      "type": "error",
      "name": "FailedToSlash",
      "inputs": []
  },
  {
      "type": "error",
      "name": "InsufficientStake",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NotOwner",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NoteAlreadyExists",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NoteAlreadyFinalised",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NoteDoesNotExist",
      "inputs": []
  },
  {
      "type": "error",
      "name": "PostUrlInvalid",
      "inputs": []
  },
  {
      "type": "error",
      "name": "RatingAlreadyExists",
      "inputs": []
  },
  {
      "type": "error",
      "name": "RatingInvalid",
      "inputs": []
  }
];

export const FC_1155_CONTRACT_ABI = [
  {
      "type": "constructor",
      "inputs": [
          {
              "name": "_owner",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "_backend",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "MAX_TOKEN_SUPPLY",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "MINT_PRICE",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "SUPPLY_EXHAUSTED",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "backend",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
          {
              "name": "account",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "balanceOfBatch",
      "inputs": [
          {
              "name": "accounts",
              "type": "address[]",
              "internalType": "address[]"
          },
          {
              "name": "ids",
              "type": "uint256[]",
              "internalType": "uint256[]"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256[]",
              "internalType": "uint256[]"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "getTokenID",
      "inputs": [
          {
              "name": "url",
              "type": "string",
              "internalType": "string"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "isApprovedForAll",
      "inputs": [
          {
              "name": "account",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "operator",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "mint",
      "inputs": [
          {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "mint",
      "inputs": [
          {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "_hash",
              "type": "bytes32",
              "internalType": "bytes32"
          },
          {
              "name": "signature",
              "type": "bytes",
              "internalType": "bytes"
          }
      ],
      "outputs": [],
      "stateMutability": "payable"
  },
  {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
          {
              "name": "",
              "type": "address",
              "internalType": "address"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "safeBatchTransferFrom",
      "inputs": [
          {
              "name": "from",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "to",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "ids",
              "type": "uint256[]",
              "internalType": "uint256[]"
          },
          {
              "name": "values",
              "type": "uint256[]",
              "internalType": "uint256[]"
          },
          {
              "name": "data",
              "type": "bytes",
              "internalType": "bytes"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "safeTransferFrom",
      "inputs": [
          {
              "name": "from",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "to",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "data",
              "type": "bytes",
              "internalType": "bytes"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "setApprovalForAll",
      "inputs": [
          {
              "name": "operator",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "approved",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "setBackend",
      "inputs": [
          {
              "name": "_backend",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "setURI",
      "inputs": [
          {
              "name": "newuri",
              "type": "string",
              "internalType": "string"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "supply",
      "inputs": [
          {
              "name": "id",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
          {
              "name": "interfaceId",
              "type": "bytes4",
              "internalType": "bytes4"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "bool",
              "internalType": "bool"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
          {
              "name": "_newOwner",
              "type": "address",
              "internalType": "address"
          }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
  },
  {
      "type": "function",
      "name": "uri",
      "inputs": [
          {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
          }
      ],
      "outputs": [
          {
              "name": "",
              "type": "string",
              "internalType": "string"
          }
      ],
      "stateMutability": "view"
  },
  {
      "type": "function",
      "name": "verifyHash",
      "inputs": [
          {
              "name": "id",
              "type": "string",
              "internalType": "string"
          },
          {
              "name": "_hash",
              "type": "bytes32",
              "internalType": "bytes32"
          }
      ],
      "outputs": [],
      "stateMutability": "pure"
  },
  {
      "type": "function",
      "name": "verifySignature",
      "inputs": [
          {
              "name": "_hash",
              "type": "bytes32",
              "internalType": "bytes32"
          },
          {
              "name": "signature",
              "type": "bytes",
              "internalType": "bytes"
          }
      ],
      "outputs": [],
      "stateMutability": "view"
  },
  {
      "type": "event",
      "name": "ApprovalForAll",
      "inputs": [
          {
              "name": "account",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "operator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "approved",
              "type": "bool",
              "indexed": false,
              "internalType": "bool"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "MintWithAdjustedValue",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "MintWithProvidedValue",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NewBackend",
      "inputs": [
          {
              "name": "backend",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "NewToken",
      "inputs": [
          {
              "name": "tokenId",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "tokenSupply",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
          {
              "name": "previousOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "newOwner",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "Refunded",
      "inputs": [
          {
              "name": "sender",
              "type": "address",
              "indexed": false,
              "internalType": "address"
          },
          {
              "name": "amount",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "TransferBatch",
      "inputs": [
          {
              "name": "operator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "from",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "to",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "ids",
              "type": "uint256[]",
              "indexed": false,
              "internalType": "uint256[]"
          },
          {
              "name": "values",
              "type": "uint256[]",
              "indexed": false,
              "internalType": "uint256[]"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "TransferSingle",
      "inputs": [
          {
              "name": "operator",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "from",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "to",
              "type": "address",
              "indexed": true,
              "internalType": "address"
          },
          {
              "name": "id",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          },
          {
              "name": "value",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "event",
      "name": "URI",
      "inputs": [
          {
              "name": "value",
              "type": "string",
              "indexed": false,
              "internalType": "string"
          },
          {
              "name": "id",
              "type": "uint256",
              "indexed": true,
              "internalType": "uint256"
          }
      ],
      "anonymous": false
  },
  {
      "type": "error",
      "name": "BadMintPrice",
      "inputs": []
  },
  {
      "type": "error",
      "name": "ERC1155InsufficientBalance",
      "inputs": [
          {
              "name": "sender",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "balance",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "needed",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "tokenId",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155InvalidApprover",
      "inputs": [
          {
              "name": "approver",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155InvalidArrayLength",
      "inputs": [
          {
              "name": "idsLength",
              "type": "uint256",
              "internalType": "uint256"
          },
          {
              "name": "valuesLength",
              "type": "uint256",
              "internalType": "uint256"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155InvalidOperator",
      "inputs": [
          {
              "name": "operator",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155InvalidReceiver",
      "inputs": [
          {
              "name": "receiver",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155InvalidSender",
      "inputs": [
          {
              "name": "sender",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "ERC1155MissingApprovalForAll",
      "inputs": [
          {
              "name": "operator",
              "type": "address",
              "internalType": "address"
          },
          {
              "name": "owner",
              "type": "address",
              "internalType": "address"
          }
      ]
  },
  {
      "type": "error",
      "name": "FailedToRefund",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NoTokenAssociated",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NotAllowed",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NotOwner",
      "inputs": []
  },
  {
      "type": "error",
      "name": "SupplyExhausted",
      "inputs": []
  },
  {
      "type": "error",
      "name": "UnknownToken",
      "inputs": []
  },
  {
      "type": "error",
      "name": "ValueError",
      "inputs": []
  }
];