# fc-community-backend

## Installation

```bash
$ yarn install
```

## Running the app

You'll need to define the following env variables for the service to be able to do all of its actions:

- `REPLICATE_API_TOKEN`
- `PINATA_JWT`
- `AWS_ACCESS_KEY`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET`
- `BACKEND_PKEY`
- `NFT_MINTER_PKEY`
- `NOTE_FINALISER_PKEY`
- `BASE_MAINNET_INFRA_RPC_URL`
- `SEPOLIA_TESTNET_INFRA_RPC_URL`

See the [API's env module](./src/factchain-core/env.ts) for an always up to date list.

then run

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

and use `curl localhost:3000` to verify it's working.

## Deploy

```shell
git subtree push --prefix fc-community-backend/apps/api heroku <your_branch>:main
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```