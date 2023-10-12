#!/usr/bin/env node

import cli from "./factchainCLI";


cli();
process.on("unhandledRejection", (err) => {
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.log(chalk`{red.bold ERROR} {red ${err.toString()}}`);
  // @ts-ignore
  // console.log(chalk`{red ${err.stack}}`);
});

// const QuickNodeUrl =
//   "https://bitter-wild-market.ethereum-sepolia.quiknode.pro/770b85bd6997c00f7c8a1168965aadc05c48c745";

// const ownerPk = "0xaaf3f1e802f1d2f0e5592869d5e1a8edebb4c91f5a063584eabe7dbba70d2277";

// // const OwnerAddress =
// //   "0x02D45A86b58Ab228ee297f1647A3A647A336eC8d";

// const raterPk =
//   "0x9b3502d269b32091221f13681b95aeb0c15229a7c9c7bee7451eae2a4014a5ed";

// const provider = new ethers.JsonRpcProvider(process.env["INFRA_RPC_URL"]);

// const owner = new ethers.Wallet(ownerPk, provider);
// const rater = new ethers.Wallet(raterPk, provider);

// const factChainContractAddress = process.env["FACTCHAIN_CONTRACT_ADDRESS"]!;

// const abi = JSON.parse(fs.readFileSync("./src/factchainAbi.json", "utf-8"));
// const factChainContract = new ethers.Contract(
//   factChainContractAddress,
//   abi,
//   owner
// );

// const factChainContractWithRater = new ethers.Contract(
//   factChainContractAddress,
//   abi,
//   rater
// );

// const MINIMUM_STAKE_PER_RATING = 10_000;
// const MINIMUM_STAKE_PER_NOTE = 100_000;

// factChainContract.createNote(
//   "https://twitter.com/booba/status/1712409617873981919",
//   "This is the first factchain!",
//   {value: MINIMUM_STAKE_PER_NOTE},
// );

// factChainContractWithRater.rateNote(
//   "https://twitter.com/booba/status/1712409617873981919",
//   OwnerAddress,
//   5,
//   {value: MINIMUM_STAKE_PER_RATING},
// )

// factChainContract.finaliseNote(
//   "https://twitter.com/booba/status/1712409617873981919",
//   OwnerAddress,
//   1,
// )

// Query the last 100 blocks for any transfer
// const filter = factChainContract.filters.NoteRated
// const events = await factChainContract.queryFilter(filter, -10000)

// console.log(events);
