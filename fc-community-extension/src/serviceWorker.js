import { getNotes } from './utils/backend';
import { socialsSupportedNetworks, supportedNetworks } from './utils/constants';

let cache = {
  postUrl: '',
  creatorAddress: '',
  note: null,
  noteUrl: '',
  content: '',
};

/// For now we deactivate notifications
///
// chrome.notifications.onClicked.addListener(async (postUrl) => {
//   console.log(`Clicked on notification`, postUrl);
//   chrome.tabs.create({
//     url: postUrl
//   });
// });

const setNetworkName = async (networkName) => {
  await chrome.storage.local.set({ networkName });
  console.log(`Network name set to ${networkName} in storage`);
};

const mainHandler = async (message, sendResponse) => {
  console.log('Received message', message);

  if (message.type === 'fc-create-note') {
    console.log('Creating a note', message.postUrl);
    cache.postUrl = message.postUrl;
    const networkName = socialsSupportedNetworks.get(
      message.socialName
    ).networkName;
    await setNetworkName(networkName);

    chrome.windows.create({
      url: 'createNote.html',
      type: 'popup',
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === 'fc-get-notes') {
    const networkName = socialsSupportedNetworks.get(
      message.socialName
    ).networkName;
    const notes = await getNotes({ postUrl: message.postUrl }, networkName);
    console.log('Retrieved notes', notes);
    sendResponse(notes);
  } else if (message.type === 'fc-rate-note') {
    console.log('Rating note', message.note);
    cache.note = message.note;
    const networkName = socialsSupportedNetworks.get(
      message.socialName
    ).networkName;
    await setNetworkName(networkName);

    chrome.windows.create({
      url: 'rateNotes.html',
      type: 'popup',
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === 'fc-mint-x-note') {
    console.log(
      `Mint X note '${message.noteUrl}' with content '${message.content}'`
    );
    cache.noteUrl = message.noteUrl;
    cache.content = message.content;
    const networkName = socialsSupportedNetworks.get('x').networkName;
    await setNetworkName(networkName);

    chrome.windows.create({
      url: 'mintXNote.html',
      type: 'popup',
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === 'fc-mint-factchain-note') {
    console.log('Mint Factchain note', message.note);
    cache.postUrl = message.note.postUrl;
    cache.creatorAddress = message.note.creatorAddress;
    const networkName = socialsSupportedNetworks.get(
      message.socialName
    ).networkName;
    await setNetworkName(networkName);

    chrome.windows.create({
      url: 'mintFactchainNote.html',
      type: 'popup',
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === 'fc-get-from-cache') {
    console.log(`Get ${message.target} from cache`, cache);
    sendResponse(cache[message.target]);
  } else if (message.type === 'fc-set-address') {
    await chrome.storage.local.set({ address: message.address });
    console.log(`Address set to ${message.address} in storage`);
    sendResponse(true);
  } else if (message.type === 'fc-get-address') {
    const address = (await chrome.storage.local.get(['address'])).address || '';
    console.log(`Retrieved address ${address} from storage`);
    sendResponse({ address });
  } else if (message.type === 'fc-get-network') {
    const networkName = (await chrome.storage.local.get(['networkName']))
      .networkName;
    // By default use eth sepolia
    const network =
      supportedNetworks[networkName] || supportedNetworks['ETHEREUM_SEPOLIA'];
    console.log('Retrieved network from storage', network);
    sendResponse(network);
  } else if (message.type === 'fc-set-network') {
    await setNetworkName(message.network.networkName);
    sendResponse(true);
  }
  /// For now we deactivate notifications
  ///
  // } else if (message.type === "fc-notify") {
  // console.log(`Creating notification for ${message.postUrl}`);
  // chrome.notifications.create(message.postUrl, {
  //   type: 'basic',
  //   iconUrl: 'icons/icon_32.png',
  //   title: message.title,
  //   message: message.content,
  //   buttons: [{ title: 'Take me there' }],
  //   priority: 2
  // });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  mainHandler(message, sendResponse);
  return true;
});

console.log('Initialised');
