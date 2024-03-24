export type NetworkBlock = {
  networkName: string;
  fromBlock: number;
};

export type FactchainEventArg = {
  name: string;
  value: string;
};

export type FactchainEvent = {
  networkName: string;
  contractAddress: string;
  eventName: string;
  blockTimestamp: number;
  blockNumber: number;
  eventArgs: FactchainEventArg[];
};
