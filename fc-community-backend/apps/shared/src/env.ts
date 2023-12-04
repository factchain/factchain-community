import { Config } from "./types";

const DEFAULT_CONFIG: Config = {
  LOOKBACK_DAYS: "5",
  OWNER_PKEY: "",
  INFRA_RPC_URL: "",
  MAIN_CONTRACT_ADDRESS: "",
  NFT_CONTRACT_ADDRESS: "",
  REPLICATE_API_TOKEN: "",
  PINATA_JWT: "",
  AWS_ACCESS_KEY: "",
  AWS_SECRET_ACCESS_KEY: "",
  AWS_REGION: "",
  AWS_BUCKET: "",
  BACKEND: "",
};

export const config: Config = Object.keys(DEFAULT_CONFIG).reduce((o, key) => {
  const value = process.env[key] || DEFAULT_CONFIG[key];
  if (!value) {
    throw Error(`Env var ${key} is required but not set (value='${value}')`);
  }
  return { ...o, [key]: value };
}, {}) as Config;
