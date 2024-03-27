import { EventLog, Log, ethers } from "ethers";
import { FactchainEvent, FactchainEventArg, NetworkBlock } from "./types";

class FactchainContract {
  address: `0x${string}`;
  deploymentBlockNumber: number;
  abi: any[];
  events: Map<string, string[]>;

  constructor(
    address: `0x${string}`,
    deploymentBlockNumber: number,
    abi: any[],
  ) {
    this.address = address;
    this.deploymentBlockNumber = deploymentBlockNumber;
    this.abi = abi;
    this.events = this.abi
      .filter((abi) => abi.type === "event")
      .reduce((acc, event) => {
        acc.set(
          event.name,
          event.inputs.map((input: any) => input.name),
        );
        return acc;
      }, new Map<string, string[]>());
  }

  parseEvent(event: EventLog): FactchainEventArg[] {
    const eventArgsNames = this.events.get(event.eventName);
    if (eventArgsNames) {
      return eventArgsNames.map((argName, index) => {
        return {
          name: argName,
          value: event.args[index],
        };
      });
    } else {
      throw new Error(
        `Event ${event.eventName} not found in contract ${this.address}`,
      );
    }
  }
}

export const supportedNetworks = [
  {
    name: "Ethereum Sepolia",
    rpcUrl: process.env.ETHEREUM_SEPOLIA_INFRA_RPC_URL,
    contracts: [
      new FactchainContract(
        "0x3b5946b3bd79c2B211E49c3149872f1d66223AE7",
        5307974,
        [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "UPGRADE_INTERFACE_VERSION",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "communityNotes",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "content",
                type: "string",
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "finalRating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "communityRatings",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "createNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_content",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "finaliseNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "_finalRating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getNoteRaters",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address[]",
                internalType: "address[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "initialize",
            inputs: [
              {
                name: "initialOwner",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "minimumStakePerNote",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "minimumStakePerRating",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "noteRaters",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "owner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "proxiableUUID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "rateNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "_rating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "renounceOwnership",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "setMinimumStakePerNote",
            inputs: [
              {
                name: "_miniumStakePerNote",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "setMinimumStakePerRating",
            inputs: [
              {
                name: "_minimumStakePerRating",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "newOwner",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "upgradeToAndCall",
            inputs: [
              {
                name: "newImplementation",
                type: "address",
                internalType: "address",
              },
              {
                name: "data",
                type: "bytes",
                internalType: "bytes",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "userStats",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "numberNotes",
                type: "uint32",
                internalType: "uint32",
              },
              {
                name: "numberRatings",
                type: "uint32",
                internalType: "uint32",
              },
              {
                name: "ethRewarded",
                type: "uint96",
                internalType: "uint96",
              },
              {
                name: "ethSlashed",
                type: "uint96",
                internalType: "uint96",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "CreatorRewarded",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "reward",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "CreatorSlashed",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "slash",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Initialized",
            inputs: [
              {
                name: "version",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "MinimumStakePerNoteUpdated",
            inputs: [
              {
                name: "newMinimumStake",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "MinimumStakePerRatingUpdated",
            inputs: [
              {
                name: "newMinimumStake",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteCreated",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteFinalised",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "finalRating",
                type: "uint8",
                indexed: true,
                internalType: "uint8",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteRated",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rating",
                type: "uint8",
                indexed: true,
                internalType: "uint8",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RaterRewarded",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "reward",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RaterSlashed",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "slash",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "ReserveFunded",
            inputs: [
              {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Upgraded",
            inputs: [
              {
                name: "implementation",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AddressEmptyCode",
            inputs: [
              {
                name: "target",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "CantRateOwnNote",
            inputs: [],
          },
          {
            type: "error",
            name: "ContentInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "ERC1967InvalidImplementation",
            inputs: [
              {
                name: "implementation",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "ERC1967NonPayable",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedInnerCall",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedToReward",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedToSlash",
            inputs: [],
          },
          {
            type: "error",
            name: "InsufficientStake",
            inputs: [],
          },
          {
            type: "error",
            name: "InvalidInitialization",
            inputs: [],
          },
          {
            type: "error",
            name: "NotInitializing",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteAlreadyExists",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteAlreadyFinalised",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteDoesNotExist",
            inputs: [],
          },
          {
            type: "error",
            name: "OwnableInvalidOwner",
            inputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "OwnableUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "PostUrlInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "RatingAlreadyExists",
            inputs: [],
          },
          {
            type: "error",
            name: "RatingInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "UUPSUnauthorizedCallContext",
            inputs: [],
          },
          {
            type: "error",
            name: "UUPSUnsupportedProxiableUUID",
            inputs: [
              {
                name: "slot",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      ),
    ],
  },
  {
    name: "Base Mainnet",
    rpcUrl: process.env.BASE_MAINNET_INFRA_RPC_URL,
    contracts: [
      new FactchainContract(
        "0xde31FB31adeB0a97E34aCf7EF4e21Ad585F667f7",
        11654488,
        [
          {
            type: "constructor",
            inputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "receive",
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "UPGRADE_INTERFACE_VERSION",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "communityNotes",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "content",
                type: "string",
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "finalRating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "communityRatings",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "createNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_content",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "finaliseNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "_finalRating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getNoteRaters",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address[]",
                internalType: "address[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "initialize",
            inputs: [
              {
                name: "initialOwner",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "minimumStakePerNote",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "minimumStakePerRating",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "noteRaters",
            inputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "owner",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "proxiableUUID",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "rateNote",
            inputs: [
              {
                name: "_postUrl",
                type: "string",
                internalType: "string",
              },
              {
                name: "_creator",
                type: "address",
                internalType: "address",
              },
              {
                name: "_rating",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "renounceOwnership",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "setMinimumStakePerNote",
            inputs: [
              {
                name: "_miniumStakePerNote",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "setMinimumStakePerRating",
            inputs: [
              {
                name: "_minimumStakePerRating",
                type: "uint64",
                internalType: "uint64",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "transferOwnership",
            inputs: [
              {
                name: "newOwner",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "upgradeToAndCall",
            inputs: [
              {
                name: "newImplementation",
                type: "address",
                internalType: "address",
              },
              {
                name: "data",
                type: "bytes",
                internalType: "bytes",
              },
            ],
            outputs: [],
            stateMutability: "payable",
          },
          {
            type: "function",
            name: "userStats",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "numberNotes",
                type: "uint32",
                internalType: "uint32",
              },
              {
                name: "numberRatings",
                type: "uint32",
                internalType: "uint32",
              },
              {
                name: "ethRewarded",
                type: "uint96",
                internalType: "uint96",
              },
              {
                name: "ethSlashed",
                type: "uint96",
                internalType: "uint96",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "CreatorRewarded",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "reward",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "CreatorSlashed",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "slash",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Initialized",
            inputs: [
              {
                name: "version",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "MinimumStakePerNoteUpdated",
            inputs: [
              {
                name: "newMinimumStake",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "MinimumStakePerRatingUpdated",
            inputs: [
              {
                name: "newMinimumStake",
                type: "uint64",
                indexed: false,
                internalType: "uint64",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteCreated",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteFinalised",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "finalRating",
                type: "uint8",
                indexed: true,
                internalType: "uint8",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "NoteRated",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rating",
                type: "uint8",
                indexed: true,
                internalType: "uint8",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "OwnershipTransferred",
            inputs: [
              {
                name: "previousOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "newOwner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RaterRewarded",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "reward",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RaterSlashed",
            inputs: [
              {
                name: "postUrl",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "creator",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rater",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "slash",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "stake",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "ReserveFunded",
            inputs: [
              {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Upgraded",
            inputs: [
              {
                name: "implementation",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AddressEmptyCode",
            inputs: [
              {
                name: "target",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "CantRateOwnNote",
            inputs: [],
          },
          {
            type: "error",
            name: "ContentInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "ERC1967InvalidImplementation",
            inputs: [
              {
                name: "implementation",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "ERC1967NonPayable",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedInnerCall",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedToReward",
            inputs: [],
          },
          {
            type: "error",
            name: "FailedToSlash",
            inputs: [],
          },
          {
            type: "error",
            name: "InsufficientStake",
            inputs: [],
          },
          {
            type: "error",
            name: "InvalidInitialization",
            inputs: [],
          },
          {
            type: "error",
            name: "NotInitializing",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteAlreadyExists",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteAlreadyFinalised",
            inputs: [],
          },
          {
            type: "error",
            name: "NoteDoesNotExist",
            inputs: [],
          },
          {
            type: "error",
            name: "OwnableInvalidOwner",
            inputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "OwnableUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "PostUrlInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "RatingAlreadyExists",
            inputs: [],
          },
          {
            type: "error",
            name: "RatingInvalid",
            inputs: [],
          },
          {
            type: "error",
            name: "UUPSUnauthorizedCallContext",
            inputs: [],
          },
          {
            type: "error",
            name: "UUPSUnsupportedProxiableUUID",
            inputs: [
              {
                name: "slot",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      ),
    ],
  },
];

export const getNetworkToBlocks = async (): Promise<NetworkBlock[]> => {
  const networkToBlocks: NetworkBlock[] = await Promise.all(
    supportedNetworks.map(async (network) => {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const blockNumber = await provider.getBlockNumber();
      return {
        networkName: network.name,
        lastBlock: blockNumber,
      };
    }),
  );
  return networkToBlocks;
};

export const getEventsForNetwork = async (
  networkName: string,
  fromBlock: number,
  toBlock: number,
): Promise<FactchainEvent[]> => {
  const network = supportedNetworks.find(
    (network) => network.name === networkName,
  );
  if (!network) {
    throw new Error(`Network ${networkName} not supported`);
  }
  const provider = new ethers.JsonRpcProvider(network.rpcUrl);

  console.log(
    `Getting events for network ${networkName} from block ${fromBlock} to block ${toBlock}`,
  );
  const maxBlockSpan = 10000;
  let currentBlock = fromBlock;
  const events: any[] = [];
  while (currentBlock < toBlock) {
    const nextBlock = Math.min(currentBlock + maxBlockSpan, toBlock);
    events.push(
      ...(await getEvents(network, provider, currentBlock, nextBlock)),
    );
    currentBlock = nextBlock;
  }
  return events;
};

const getEvents = async (
  network: any,
  provider: ethers.JsonRpcProvider,
  fromBlock: number,
  toBlock: number,
): Promise<FactchainEvent[]> => {
  console.log(
    `Getting ${network.name} events from block ${fromBlock} to block ${toBlock}`,
  );
  // keep track of block timestamps to avoid querying the same block multiple times
  const blockTimestamps: Record<string, string> = {};

  // iterate over all contracts in the network
  const allLogs = await Promise.all(
    network.contracts.map(async (factchainContract: FactchainContract) => {
      // Don't try to get any logs before the contract was deployed
      fromBlock = Math.max(fromBlock, factchainContract.deploymentBlockNumber);
      if (fromBlock >= toBlock) {
        return [];
      }
      const contract = new ethers.Contract(
        factchainContract.address,
        factchainContract.abi,
        provider,
      );
      const events = await contract.queryFilter("*", fromBlock, toBlock);
      // iterate over all events in the contract
      const contractEvents: Array<FactchainEvent | null> = await Promise.all(
        events.map(async (event: Log | EventLog) => {
          if (event instanceof EventLog) {
            if (!blockTimestamps[event.blockHash]) {
              blockTimestamps[event.blockHash] = (
                await event.getBlock()
              ).timestamp.toString();
            }
            return {
              networkName: network.name,
              contractAddress: event.address,
              eventName: event.eventName,
              blockTimestamp: parseInt(blockTimestamps[event.blockHash]),
              blockNumber: event.blockNumber,
              eventArgs: factchainContract.parseEvent(event),
            };
          } else {
            return null;
          }
        }),
      );
      return contractEvents.filter((event) => event !== null);
    }),
  );
  return allLogs.flat();
};

export const listenToEvents = (
  handler: (factchainEvent: FactchainEvent) => void,
) => {
  supportedNetworks.map((network) => {
    listenToEventsForNetwork(network, handler);
  });
};

const listenToEventsForNetwork = (
  network: any,
  handler: (factchainEvent: FactchainEvent) => void,
) => {
  const provider = new ethers.WebSocketProvider(
    network.rpcUrl.replace("https", "wss"),
  );
  network.contracts.map((factchainContract: FactchainContract) => {
    const contract = new ethers.Contract(
      factchainContract.address,
      factchainContract.abi,
      provider,
    );

    console.log(
      `Listening to events for contract ${factchainContract.address} on network ${network.name}`,
    );
    contract.on("*", (newEvent) => {
      try {
        const event = newEvent.log;
        console.log("New event received", event);
        const factchainEvent = {
          networkName: network.name,
          contractAddress: event.address,
          eventName: event.eventName,
          blockTimestamp: Math.floor(Date.now() / 1000),
          blockNumber: event.blockNumber,
          eventArgs: factchainContract.parseEvent(event),
        };
        handler(factchainEvent);
      } catch (e) {
        console.error("Error processing event", e);
      }
    });
  });
};
