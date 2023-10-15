import { BACKEND_URL } from "./constants";

console.log("Initialised");

let targetPostUrl = "";

const getNotes = (postUrl, handler) => {
  const urlParams = new URLSearchParams({postUrl});
  fetch(`${BACKEND_URL}/notes?${urlParams}`, {
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
    targetPostUrl = message.postUrl;

    chrome.windows.create({
        url: "createNote.html",
        type: "popup",
        focused: true,
        width: 400,
        height: 600,
        top: 0,
        left: 0,
    });
  } else if (message.type === "fc-get-post-url") {
    console.log("Get post url");
    sendResponse(targetPostUrl);
  } else if (message.type === "fc-get-notes") {
    getNotes(message.postUrl, (notes) => {
      console.log("Retrieved notes", notes);
      sendResponse(notes);
    });
  } else if (message.type === "fc-rate-notes") {
    console.log("Rating notes", message.notes);
    targetPostUrl = message.postUrl;

    chrome.windows.create({
        url: "rateNotes.html",
        type: "popup",
        focused: true,
        width: 400,
        height: 600,
        top: 0,
        left: 0,
    });
  }
  
  return true;
});