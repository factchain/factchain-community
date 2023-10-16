const BACKEND_URL = "https://fc-community-backend-15f6c753d352.herokuapp.com";
let cache = {
  postUrl: "",
  notes: [],
};

chrome.notifications.onClicked.addListener(async (postUrl) => {
  console.log(`Clicked on notification`, postUrl);
  chrome.tabs.create({
    url: postUrl
  });
});

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
  } else if (message.type === "fc-notify") {
    console.log(`Creating notification for ${message.postUrl}`);
    chrome.notifications.create(message.postUrl, {
      type: 'basic',
      iconUrl: 'icons/icon_32.png',
      title: message.title,
      message: message.content,
      buttons: [{ title: 'Take me there' }],
      priority: 2
    });
  } else if (message.type === "fc-get-from-cache") {
    console.log(`Get ${message.target} from cache`);
    sendResponse(cache[message.target]);
  }
  
  return true;
});

console.log("Initialised");
