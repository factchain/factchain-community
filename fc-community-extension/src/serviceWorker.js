import { getNotes, getXNoteId } from "./utils/backend";

let cache = {
  postUrl: "",
  notes: [],
};

/// For now we deactivate notifications
///
// chrome.notifications.onClicked.addListener(async (postUrl) => {
//   console.log(`Clicked on notification`, postUrl);
//   chrome.tabs.create({
//     url: postUrl
//   });
// });


const mainHandler = async (message, sendResponse) => {
  console.log("Received message", message);

  if (message.type === "fc-create-note") {
    console.log("Creating a note", message.postUrl);
    cache.postUrl = message.postUrl;

    chrome.windows.create({
      url: "createNote.html",
      type: "popup",
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === "fc-get-notes") {
    const notes = await getNotes({postUrl: message.postUrl});
    console.log("Retrieved notes", notes);
    sendResponse(notes);
  } else if (message.type === "fc-rate-notes") {
    console.log("Rating notes", message.notes);
    cache.postUrl = message.notes[0].postUrl;
    cache.notes = message.notes;

    chrome.windows.create({
      url: "rateNotes.html",
      type: "popup",
      focused: true,
      width: 400,
      height: 600,
      top: 0,
      left: 0,
    });
  } else if (message.type === "fc-get-from-cache") {
    console.log(`Get ${message.target} from cache`);
    sendResponse(cache[message.target]);
  } else if (message.type === "fc-mint-twitter-note") {
    console.log(`Mint twitter note '${message.noteUrl}' with content '${message.content}' to address ${message.address}`);

    const response = await getXNoteId(message.noteUrl, message.content);
    console.log("Got id, hash, and signature for note", response);
    sendResponse(response);
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

console.log("Initialised");
