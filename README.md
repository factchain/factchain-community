[![Backend Deployment](https://github.com/factchain/factchain-community/actions/workflows/backend-deploy.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/backend-deploy.yml) [![Deploy main contract](https://github.com/factchain/factchain-community/actions/workflows/deploy-main-contract.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/deploy-main-contract.yml) [![Deploy NFT contract](https://github.com/factchain/factchain-community/actions/workflows/deploy-nft-contract.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/deploy-nft-contract.yml) [![Deploy Twitter contract](https://github.com/factchain/factchain-community/actions/workflows/deploy-x-community-notes-contract.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/deploy-community-notes-contract.yml) [![Deploy SFT contract](https://github.com/factchain/factchain-community/actions/workflows/deploy-sft-contract.yml/badge.svg?branch=main)](https://github.com/factchain/factchain-community/actions/workflows/deploy-sft-contract.yml)

[![Contracts Code Checks](https://github.com/factchain/factchain-community/actions/workflows/contracts-code-checks.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/contracts-code-checks.yml) [![Extension Code Checks](https://github.com/factchain/factchain-community/actions/workflows/extension-code-checks.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/extension-code-checks.yml) [![Extension Build](https://github.com/factchain/factchain-community/actions/workflows/build-extension.yml/badge.svg)](https://github.com/factchain/factchain-community/actions/workflows/build-extension.yml) 

# Factchain

Decentralized notes, decentralized rewards. A collaborative approach to combating misinformation, one block at a time.

Factchainers can record notes about any social media post on the blockchain. If enough contributors from different viewpoints rate a note as helpful, Factchain browser extension will use it to enrich the social media website.

- Notes & votes are permissionless. No central authority to trust.
- Transparent incentives for note writers & voters. Factchain rewards writers who create helpful notes & voters who identify helpful/misleading notes
- Factchain's truth layer works for any social media platform:
  - Factchain's browser extension adds Factchain notes on top of social media posts
  - Anyone can query the Factchain API for notes on social media posts

## Links
- [Manifesto](https://factchain.tech/)
- [PoC Demo](https://drive.google.com/file/d/1tJgjMYLVi_VUSCHalCxqlsctuYiVFX4W/view?usp=share_link)
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

### Create a note

- Select a post you want to create a note on, and click on the 3 dots
- Click on `Create Factchain Note` and go through the steps

![Create note](./create.gif)

### Rate a note

- Open a post with an existing note you want to rate
- The note will be visible under the post
- Click on `Rate it` and go through the steps

![Rate note](./rate.gif)