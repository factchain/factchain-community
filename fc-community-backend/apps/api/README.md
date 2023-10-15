# fc-community-backend

## Installation

```bash
$ yarn install
```

## Running the app

You'll need to define the following env variables:

- `OWNER_PKEY`
- `INFRA_RPC_URL`
- `FACTCHAIN_CONTRACT_ADDRESS`

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

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```