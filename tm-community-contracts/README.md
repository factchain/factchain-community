# tm-community-contracts

To get `foundry`, check https://book.getfoundry.sh/getting-started/installation

Then, in this folder, run:

```sh
forge install foundry-rs/forge-std
forge test -vvv
forge coverage --report lcov && genhtml -o report lcov.info --branch-coverage
```

## Possible improvements

- [ ] On note creation, require a minimum amount staked instead of > 0
- [ ] Allow the Owner to deactivate slashing for raters (=> anyone can rate)
- [ ] ...