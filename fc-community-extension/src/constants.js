export const METAMASK_ID = "nkbihfbeogaeaoehlefnkodbefgpgknn";
export const POST_URL_REGEX = /^(https:\/\/(twitter|x).com\/.+?\/status\/\d+).*$/;
export const NOTE_URL_REGEX = /^(https:\/\/(twitter|x).com\/.+?\/birdwatch\/.+?\/\d+).*$/;
export const parseUrl = (url, regex) => url.match(regex)[1].replace("twitter.com", "x.com");
// TODO read address from service once
export const FC_CONTRACT_ADDRESS = "0xb912368c62D3037F7E86C2e95D9B5F4FC86c9428";
export const FC_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CantRateOwnNote",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ContentInvalid",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedToReward",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedToSlash",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientStake",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoteAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoteAlreadyFinalised",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoteDoesNotExist",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PostUrlInvalid",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RatingAlreadyExists",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RatingInvalid",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "CreatorRewarded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "slash",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "CreatorSlashed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "NoteCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint8",
        "name": "finalRating",
        "type": "uint8"
      }
    ],
    "name": "NoteFinalised",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "rater",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "NoteRated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "rater",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "RaterRewarded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "rater",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "slash",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "stake",
        "type": "uint256"
      }
    ],
    "name": "RaterSlashed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ReserveFunded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "communityNotes",
    "outputs": [
      {
        "internalType": "string",
        "name": "postUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "finalRating",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "communityRatings",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_postUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_content",
        "type": "string"
      }
    ],
    "name": "createNote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_postUrl",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_finalRating",
        "type": "uint8"
      }
    ],
    "name": "finaliseNote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "noteRaters",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_postUrl",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_rating",
        "type": "uint8"
      }
    ],
    "name": "rateNote",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

export const FC_1155_CONTRACT_ADDRESS = "0xca81C4767aA05a026602C753CE58bd2FBb546AeC";
export const FC_1155_CONTRACT_ABI = [
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
      "name": "Greed",
      "inputs": []
  },
  {
      "type": "error",
      "name": "NoTokenAssociated",
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
  }
];