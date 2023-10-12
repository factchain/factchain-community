declare namespace NodeJS {
  interface ProcessEnv {
    INFRA_RPC_URL?: string | undefined;
    FACTCHAIN_CONTRACT_ADDRESS?: string | undefined;
    OWNER_PKEY?: string | undefined;
  }
}
