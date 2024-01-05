const BACKEND_URL = "https://fc-community-backend-15f6c753d352.herokuapp.com";


export const getNotes = async () => {
    const fullUrl = `${BACKEND_URL}/notes`;
    console.log("Getting notes", fullUrl);
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data.notes;
    } catch (error) {
        console.error("Error fetching notes:", error);
        throw error; 
    }
};


export const getNotesWithHandler = (postUrl, handler) => {
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
  
  export const getXNoteId = (noteUrl, content, handler) => {
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