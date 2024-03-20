const BACKEND_URL = 'https://api.factchain.tech';

import { socialsSupportedNetworks } from './constants';

export const getNotes = async (queryparams, network) => {
  console.log(network);
  let fullUrl = `${BACKEND_URL}/notes`;
  if (queryparams) {
    const urlParams = new URLSearchParams(queryparams);
    fullUrl = `${BACKEND_URL}/notes?${urlParams}`;
  }
  console.log('Getting notes', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        network: network,
      },
    });
    const data = await response.json();
    const validNotes = data.notes
      .map((note) => {
        try {
          new URL(note.postUrl);
          return note;
        } catch (error) {
          console.error(`Invalid post URL: ${note.postUrl}`);
          return null;
        }
      })
      .filter((note) => note !== null);
    // sort notes by ascending age (most recent first).
    const sortedNotes = validNotes.sort(
      (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
    );
    return sortedNotes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const getNotesForAllSocials = async (queryparams) => {
  try {
    const notesPromiseMap = new Map();
    // Create promises for each network's notes and store them in the map
    for (const [social, network] of socialsSupportedNetworks.entries()) {
      notesPromiseMap.set(social, getNotes(queryparams, network.networkName));
    }
    // Await all promises concurrently
    const socialNotesEntries = await Promise.allSettled([
      ...notesPromiseMap.values(),
    ]);

    // Construct a Map of social names to notes
    const socialNotesMap = new Map();
    socialNotesEntries.forEach((result, index) => {
      const social = [...notesPromiseMap.keys()][index];
      socialNotesMap.set(
        social,
        result.status === 'fulfilled' ? result.value : null
      );
    });
    console.log(socialNotesMap);
    return socialNotesMap;
  } catch (error) {
    console.error('Error fetching notes for all socials:', error);
    throw error;
  }
};

export const getXNoteId = async (noteUrl) => {
  const getUrlParams = new URLSearchParams({ noteUrl });
  const getUrl = `${BACKEND_URL}/x/note/id?${getUrlParams}`;
  console.log('Getting id for note', getUrl);

  try {
    let response = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 404) {
      console.log('X Note id not found');
      // Handle 404 specifically
      return null;
    } else {
      const data = await response.json();
      return {
        id: data.id,
        hash: data.hash,
        signature: data.signature,
      };
    }
  } catch (error) {
    console.error('Error fetching X Note id:', error);
    throw error;
  }
};

export const createXNoteId = async (noteUrl, content) => {
  try {
    const response = await fetch(`${BACKEND_URL}/x/note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ noteUrl, content }),
    });
    const data = await response.json();
    return {
      id: data.id,
      hash: data.hash,
      signature: data.signature,
    };
  } catch (error) {
    console.error('Error creating X Note id:', error);
    throw error;
  }
};

export const awaitOpenSeaUrl = async (openseaUrl) => {
  console.log('Waiting for opensea url to be ok', openseaUrl);
  let retry = 10;
  while (retry > 0) {
    try {
      const response = await fetch(openseaUrl, {
        method: 'GET',
      });
      if (response.ok) {
        console.log('Opensea url is ok', openseaUrl);
        return true;
      } else {
        console.log('Opensea url is not ok', response.status);
      }
    } catch (error) {
      console.error('Error checking opensea url:', error);
    }
    retry--;
    // sleep 1sec
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
};
