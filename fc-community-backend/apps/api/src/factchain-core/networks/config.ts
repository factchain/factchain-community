import { config } from "../env";

export interface NetworkConfig {
  INFRA_RPC_URL: string;
  MAIN_CONTRACT_ADDRESS: string;
  NFT_CONTRACT_ADDRESS: string;
  SFT_CONTRACT_ADDRESS: string;
  X_CONTRACT_ADDRESS?: string;
}

export interface NetworkConfigs {
  BASE_MAINNET: NetworkConfig;
  ETHEREUM_SEPOLIA: NetworkConfig;
}

const networks: NetworkConfigs = {
  BASE_MAINNET: {
    INFRA_RPC_URL: "<OVERRIDE ME>",
    MAIN_CONTRACT_ADDRESS: "0xde31FB31adeB0a97E34aCf7EF4e21Ad585F667f7",
    NFT_CONTRACT_ADDRESS: "0x8885DC14732AE2ADd64d8C6581E722F0A88aA3Da",
    SFT_CONTRACT_ADDRESS: "0x77840A1815f4F62a4cCCA3aBA3566fB8ff0b10D0",
  },
  ETHEREUM_SEPOLIA: {
    INFRA_RPC_URL: "<OVERRIDE ME>",
    MAIN_CONTRACT_ADDRESS: "0x3b5946b3bd79c2B211E49c3149872f1d66223AE7",
    NFT_CONTRACT_ADDRESS: "0x5818764B4272f4eCff170216abE99D36c0c41622",
    SFT_CONTRACT_ADDRESS: "0xF9408EB2C2219E28aEFB32035c49d491880650A2",
    X_CONTRACT_ADDRESS: "0xaC51f5E2664aa966c678Dc935E0d853d3495A48C",
  },
};

export function getNetworkConfig(
  networkKey: keyof NetworkConfigs,
): NetworkConfig {
  // default to Sepolia to avoid extension breaking change
  // TODO: throw BadRequest when extension is updated
  // Only replace the networkKey if it is not set.
  const updatedNetworkKey = networkKey || "ETHEREUM_SEPOLIA";
  const network = networks[updatedNetworkKey];
  // Logging what we really use, but before adding the secret rpc url. Future-us will be thankful.
  console.log(`using network ${updatedNetworkKey}`, network);
  network.INFRA_RPC_URL = config[`${updatedNetworkKey}_INFRA_RPC_URL`];
  return network;
}
