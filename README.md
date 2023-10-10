# factchain-community

Decentralized notes, decentralized rewards. A collaborative approach to combating misinformation, block by block.

Contributors to Factchain Community can record notes about any social media post on the blockchain. If enough contributors from different viewpoints rate a note as helpful on the blockchain, the note will be displayed on factchain.tech, and on the Factchain browser extension.

- Notes & votes are permissionless. No central authority to trust.
- Transparent incentives for note writers & voters. Truemint rewards writers who create helpful notes & voters who identify helpful/misleading notes
- Factchain's truth layer works for any social media platform:
  - Factchain's browser extension adds Truemint notes on top of social media posts
  - Anyone can query the Factchain API for notes on social media posts

## TODO

### TECH

- contract
    - writing the note on chain is not future proof
    - push to ipfs? like nfts
    - can the contract be erc1155 compliant?
    - proxy? makes things a bit simpler for CD
    - IMPORTANT: available balance following a creation/rate of note
        - this avoids stake+create+withdraw
- static page
    - needed? if yes, as samll as possible
- link factchain.tech to a cloud
    - heroku?
- extension
    - fetch events on-chain
    - connect to ethereum provider
    - needs metamask on the side
- backend
    - to run the final rating algo
    - final rating depends on algo and history of raters
        - we may want to push the block id at which we stopped to calculate the final rating
        - + algo version/hash
        - or something like that to simplify reruns

### PRODUDCT

- Dany to write down his degen ideas
- Baptiste to list documents we need to produce + what is needed in them + how we can help
