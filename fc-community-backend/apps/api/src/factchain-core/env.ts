import { Config } from "./types";

const DEFAULT_CONFIG: Config = {
  LOOKBACK_DAYS: "365",
  USEFUL_NOTE_THRESHOLD: "3",
  MINIMUM_RATING: "1",
  REPLICATE_API_TOKEN: "",
  BASE_MAINNET_INFRA_RPC_URL: "",
  ETHEREUM_SEPOLIA_INFRA_RPC_URL: "",
  PINATA_JWT: "",
  AWS_ACCESS_KEY: "",
  AWS_SECRET_ACCESS_KEY: "",
  AWS_REGION: "",
  AWS_BUCKET: "",
  BACKEND_PKEY: "",
  ETHEREUM_SEPOLIA_NFT_MINTER_PKEY: "",
  ETHEREUM_SEPOLIA_NOTE_FINALISER_PKEY: "",
  BASE_MAINNET_NFT_MINTER_PKEY: "",
  BASE_MAINNET_NOTE_FINALISER_PKEY: "",
  MONGO_USER: "",
  MONGO_PASSWORD: "",
  MONGO_CLUSTER: "",
  MONGO_APP_NAME: "",
};

export const config: Config = Object.keys(DEFAULT_CONFIG).reduce((o, key) => {
  const value = process.env[key] || DEFAULT_CONFIG[key];
  if (!value) {
    throw Error(`Env var ${key} is required but not set (value='${value}')`);
  }
  return { ...o, [key]: value };
}, {}) as Config;
