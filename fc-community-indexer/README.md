# indexer

## Config

You need a `.env` file:

```
MONGO_CLUSTER=factchainprodcluster.abavcv6.mongodb.net
MONGO_APP_NAME=FactchainProdCluster
MONGO_USER=factchain
MONGO_PASSWORD=<password>
ETHEREUM_SEPOLIA_RPC_URL=<quicknode_url>
BASE_MAINNET_RPC_URL=<quicknode_url>
```

## Run

```bash
yarn install
# Running pull synchroniser
yarn run sync-dev
# Running listener
yarn run dev
```
