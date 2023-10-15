console.log("Initialised");

let postUrl = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message", message);

  if (message.type === "fc-create-note") {
    postUrl = message.postUrl;

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
    sendResponse(postUrl);
  }
  
  return true;
});