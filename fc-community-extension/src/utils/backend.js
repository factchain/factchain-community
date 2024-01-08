import { sanitizeXUrl } from "./constants";

const BACKEND_URL = "https://fc-community-backend-15f6c753d352.herokuapp.com";

export const getNotes = async (queryparams) => {
  let fullUrl = `${BACKEND_URL}/notes`;
  if (queryparams) {
    queryparams.postUrl = sanitizeXUrl(queryparams.postUrl);
    const urlParams = new URLSearchParams(queryparams);
    fullUrl = `${BACKEND_URL}/notes?${urlParams}`;
  }
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
  
export const getXNoteId = async (noteUrl, content) => {
  const cleanNoteUrl = sanitizeXUrl(noteUrl);
  const getUrlParams = new URLSearchParams({noteUrl: cleanNoteUrl});
  const getUrl = `${BACKEND_URL}/x/note/id?${getUrlParams}`;
  console.log("Getting id for note", getUrl);
  
  let response = await fetch(getUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (!response.ok) {
    if (response.status === 404) {
      console.log('Resource not found');
      // Handle 404 specifically
      response = await createXNoteId(cleanNoteUrl, content);
    } else {
      // Handle other HTTP errors
      console.log('HTTP error:', response.status);
      throw new Error('HTTP error: ' + response.status);
    }
  }
  const data = await response.json();
  return {
    id: data.id,
    hash: data.hash,
    signature: data.signature,
  };
}
  
export const createXNoteId = async (noteUrl, content) => {
  const cleanNoteUrl = sanitizeXUrl(noteUrl);
  console.log("Creating page pendingNFTCreation.html");
  const window = await chrome.windows.create({
    url: "pendingNFTCreation.html",
    type: "popup",
    focused: true,
    width: 300,
    height: 100,
    top: 0,
    left: 0,
  });
  
  try {
    const response = await fetch(`${BACKEND_URL}/x/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({noteUrl: cleanNoteUrl, content})
    });
    chrome.windows.remove(window.id);
    return response;
  } catch (error) {
    console.error("Error fetching notes:", error);
    chrome.windows.remove(window.id);
    throw error;
  }
}
