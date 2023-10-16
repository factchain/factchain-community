import { EventLog, ethers, ContractTransactionResponse } from "ethers";
import { Note, NoteReader, Rating, FactChainEvent, NoteWriter } from "./types";
import { timePeriodToBlockPeriods } from "./utils";

const MINIMUM_STAKE_PER_RATING = 10_000;
const MINIMUM_STAKE_PER_NOTE = 100_000;
const JSON_ABI = [
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

export class FactChainContract implements NoteReader, NoteWriter {
  private _provider: ethers.AbstractProvider;
  private _contract: ethers.Contract;

  constructor(pkey: string) {
    this._provider = new ethers.JsonRpcProvider(process.env["INFRA_RPC_URL"]);
    const user_identity = new ethers.Wallet(pkey, this._provider);
    this._contract = new ethers.Contract(
      process.env["FACTCHAIN_CONTRACT_ADDRESS"]!,
      JSON_ABI,
      user_identity,
    );
  }

  getEvents = async (
    eventType: FactChainEvent,
    fromBlock: number,
    toBlock: number,
  ): Promise<Array<EventLog>> => {
    const logs = await this._contract.queryFilter(
      this._contract.filters[eventType],
      fromBlock,
      toBlock,
    );
    const eventLogs = logs
      .filter((log) => log.hasOwnProperty("args"))
      .map((e) => <EventLog>e);
    return eventLogs;
  };

  getNote = async (postUrl: string, creator: string): Promise<Note> => {
    const result = await this._contract.communityNotes(postUrl, creator);
    return {
      postUrl: result[0],
      content: result[1],
      creator: result[2],
    };
  };

  getNotes = async (postUrl: string): Promise<Array<Note>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    // TODO: see if 5 days lookback is suitable for the demo 
    const today = new Date();
    const lookbackDays = parseInt(process.env["GET_NOTES_LOOKBACK_DAYS"] || "5");
    const from = new Date(today.getTime() - (lookbackDays * 24 * 60 * 60 * 1000))
    console.log(`Getting notes created on '${postUrl}' between ${from} and ${today}`);

    const block_periods = timePeriodToBlockPeriods(
      from,
      today,
      currentBlockNumber,
    );
    let notePromises: Promise<Note>[] = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteCreated", period[0], period[1]);
      console.log(`Notes between blocks ${period[0]} and ${period[1]}`, block_periods);
      const relatedEvents = events.filter((e) => e.args[0] == postUrl);
      if (relatedEvents) {
        notePromises = notePromises.concat(relatedEvents.map(
          async (event) => {
            return await this.getNote(event.args[0], event.args[1]);
          },
        ));
      }
    }
    const notes = await Promise.all(notePromises);
    return notes;
  };

  getRatings = async (from: Date, to: Date): Promise<Array<Rating>> => {
    const currentBlockNumber = await this._provider.getBlockNumber();
    const block_periods = timePeriodToBlockPeriods(
      from,
      to,
      currentBlockNumber,
    );
    var ratings: Array<Rating> = [];
    for (const period of block_periods) {
      const events = await this.getEvents("NoteRated", period[0], period[1]);
      ratings = ratings.concat(
        events.map((event) => ({
          postUrl: event.args[0],
          creator: event.args[1],
          value: event.args[3],
        })),
      );
    }
    return ratings;
  };

  createNote = async (
    postUrl: string,
    text: string,
  ): Promise<ContractTransactionResponse> => {
    const transactionResponse = await this._contract.createNote(postUrl, text, {
      value: MINIMUM_STAKE_PER_NOTE,
    });
    return transactionResponse;
  };

  rateNote = async (
    postUrl: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._contract.rateNote(
      postUrl,
      creator,
      rating,
      {
        value: MINIMUM_STAKE_PER_RATING,
      },
    );
    return transactionResponse;
  };

  finaliseNote = async (
    postUrl: string,
    creator: string,
    rating: number,
  ): Promise<ContractTransactionResponse> => {
    if (!(rating > 0 && rating < 6)) {
      throw new Error("Bad rating!");
    }
    const transactionResponse = await this._contract.finaliseNote(
      postUrl,
      creator,
      rating,
    );
    return transactionResponse;
  };
}
