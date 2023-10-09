# tm-community-contracts

To get `foundry`, check https://book.getfoundry.sh/getting-started/installation

Then, in this folder, run:

```sh
# update the deps
forge install
# if you want to add a new dep, run
# `forge install <dep> --no-git --no-commit``
forge test -vvv
forge coverage --report lcov && genhtml -o report lcov.info --branch-coverage
```

## Possible improvements

- [ ] On note creation, require a minimum amount staked instead of > 0
- [ ] Allow the Owner to deactivate slashing for raters (=> anyone can rate)
- [ ] ...