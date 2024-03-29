[![Backend Deployment](https://github.com/factchain/factchain-community/actions/workflows/backend-deploy.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/backend-deploy.yml) [![Deploy contracts](https://github.com/factchain/factchain-community/actions/workflows/deploy-proxy-contract.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/deploy-proxy-contract.yml)

[![Contracts Code Checks](https://github.com/factchain/factchain-community/actions/workflows/contracts-code-checks.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/contracts-code-checks.yml) [![Extension Code Checks](https://github.com/factchain/factchain-community/actions/workflows/extension-code-checks.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/extension-code-checks.yml) [![Extension Build](https://github.com/factchain/factchain-community/actions/workflows/build-extension.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/build-extension.yml) 

# Factchain: an Ethereum-Based Truth Layer

Factchain is an immutable and transparent truth layer that supports all social platforms. It is permissionless and devoid of any central authority.

Factchainers can add context to any post, in the form of Notes,  which then get rated by the community.

Useful Notes become visible to all Factchain users, enhancing their social media experience and shielding them from misinformation.

For their work, Note Creators and Raters are rewarded by the Factchain protocol, incentivising quality contributions.

# How Does Factchain work?

Anyone with an Ethereum address can create and rate Factchain Notes by calling the Factchain Community contract

A rating algorithm runs regularly to assess ratings and give notes their final usefulnesss score.

All notes and ratings are stored forever onchain, which makes it easy for anyone to audit them and build a competing note scoring algorithm.

Creating and rating Notes requires an ETH stake. The funds remain locked in the contract until the finalisation period concludes, at which point they are distributed between all participants depending on the final rating of the Note: The better the Note, the better the rewards, but bad Notes will get you slashed. The goal is to give an incentive to users to create meaningful and useful Notes.

Notes that are deemed useful by the community are shown under their posts, providing context and nuance when navigating social media platforms.


# Put Your ETH Where Your Mouth Is. Join the Guardians of Truth.
- [Manifesto](https://factchain.tech/)
- [Deployed Contracts](https://factchain.tech/about/)

## Using Factchain

### Requirements

- Desktop only
- Google Chrome or Brave
- Metamask
- funded Sepolia account. You can get some ETH [here](https://sepoliafaucet.com/)

### Installation
- [Download the Factchain browser extension](https://chromewebstore.google.com/detail/factchain-community/emgjjedibkjlocjmcjgkeolfkbcicbpl)
- Open the extension so it can connect to your Metamask account
- Open Twitter which will also connect to your Metamask account

### Create a Factchain note

- Select a social media post you wish to add contect to
- Click on `Create Factchain Note` and write your note
- Review and sign the transaction in your wallet

![Create note](./createNote.gif)

### Rate a Factchain note

- Spot a social media post to which Factchain users have added context, or pick one from the Ratings section of the Factchain extension
- Click on `Rate it` and give the Factchain note your rating
- Review and sign the transaction in your wallet

![Rate note](./rateNote.gif)

### Collect a Factchain note

- Spot a Factchain note that you like under a scocial media post, or pick one from the Ratings section of the Factchain extension
- Click on `Collect it` 
- Review and sign the transaction in your wallet

![Rate note](./collectFactchainNote.gif)
