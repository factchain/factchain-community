const BACKEND_URL = "https://fc-community-backend-15f6c753d352.herokuapp.com";
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

const getNotes = (postUrl, handler) => {
  const urlParams = new URLSearchParams({postUrl});
  const fullUrl = `${BACKEND_URL}/notes?${urlParams}`;
  console.log("Getting notes", fullUrl)
  fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => {
    return res.json();
  }).then(res => {
    handler(res.notes);
  });
}

const getXNoteId = (noteUrl, content, handler) => {
  const getUrlParams = new URLSearchParams({noteUrl});
  const getUrl = `${BACKEND_URL}/x/note/id?${getUrlParams}`;
  console.log("Getting id for note", getUrl);
  
  fetch(getUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(res => {
    if (!res.ok) {
      if (res.status === 404) {
        console.log('Resource not found');
        // Handle 404 specifically
        // TODO: pop a loader
        createXNoteId(noteUrl, content, handler);
      } else {
        console.log('HTTP error:', res.status);
        // Handle other HTTP errors
      }
      throw new Error('HTTP error: ' + res.status);
    }
    return res.json();
  }).then(res => {
    handler({
      id: res.id,
      hash: res.hash,
      signature: res.signature,
    });
  });
}

const createXNoteId = (noteUrl, content, handler) => {
  console.log("Creating page pendingNFTCreation.html");
  chrome.windows.create({
    url: "pendingNFTCreation.html",
    type: "popup",
    focused: true,
    width: 300,
    height: 100,
    top: 0,
    left: 0,
  }, (window) => {
    fetch(`${BACKEND_URL}/x/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({noteUrl, content})
    }).then(res => {
      return res.json();
    }).then(res => {
      chrome.windows.remove(window.id);
      handler(res);
    }).catch(reason => {
      chrome.windows.remove(window.id);
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    getNotes(message.postUrl, (notes) => {
      console.log("Retrieved notes", notes);
      sendResponse(notes);
    });
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

    getXNoteId(message.noteUrl, message.content, (res) => {
      console.log("Got id, hash, and signature for note", res);
      sendResponse(res);
    });
    
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
  
  return true;
});

console.log("Initialised");
