console.log("Initialised");

let targetPostUrl = "";

const getNotes = (postUrl, handler) => {
  return new Promise(async () => {
    let notes = [
      {
        postUrl,
        creator: "0x02D45A86b58Ab228ee297f1647A3A647A336eC8d",
        content: "Something something something."
      },
      {
        postUrl,
        creator: "0x1E57ABB408C7Fd5d62177b6FE464730bFFc6B430",
        content: "Push push push."
      },
      {
        postUrl,
        creator: "0x8496863Bd63A611D30020e2825DaDB2FC77DBCe4",
        content: "Click click click."
      }
    ];
    handler(notes);
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