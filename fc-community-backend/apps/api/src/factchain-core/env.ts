import { Config } from "./types";

const DEFAULT_CONFIG: Config = {
  LOOKBACK_DAYS: "5",
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
  NFT_MINTER_PKEY: "",
  NOTE_FINALISER_PKEY: "",
};

export const config: Config = Object.keys(DEFAULT_CONFIG).reduce((o, key) => {
  const value = process.env[key] || DEFAULT_CONFIG[key];
  if (!value) {
    throw Error(`Env var ${key} is required but not set (value='${value}')`);
  }
  return { ...o, [key]: value };
}, {}) as Config;
