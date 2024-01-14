const BACKEND_URL = 'https://api.factchain.tech';

export const getNotes = async (queryparams) => {
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
      },
    });
    const data = await response.json();
    // Reverse the notes to have them in ascending age (most recent first).
    return data.notes.reverse();
  } catch (error) {
    console.error('Error fetching notes:', error);
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

export const getContracts = async () => {
  let fullUrl = `${BACKEND_URL}/_contracts`;
  console.log('Getting contracts', fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.contracts;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw error;
  }
};
