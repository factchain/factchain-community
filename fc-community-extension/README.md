# fc-community-extension

This project was bootstrapped with [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)

## TODO

- [X] Auto change network to sepolia
- [X] Add loading spinner during long actions, like backend calls (e.g. mint)
- [ ] Show transaction errors in popup to be reported
- [X] Move selectors to separate module
- [ ] Explore snap extension to clarify what transaction is being signed

## Usage

```bash
yarn install
yarn run watch
```

will build and run the extension locally.

Then go to `chrome://extensions` and use `Load unpacked` pointing at the `build` folder.

## Packing

Packing requires access to Chrome itself. It can be done from chrome://extensions manually, or
from the command line using

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=./build
```
