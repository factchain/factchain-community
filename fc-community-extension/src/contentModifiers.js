import { logger } from './utils/logging';
import { parseUrl, NOTE_URL_REGEX, POST_URL_REGEX } from './utils/constants';
import {
  makeFactchainNoteHtml,
  makeMintXNoteOnDetailsPageHtml,
  makeMintXNoteOnMainPageHtml,
  makeDropdownNoteCreationButton,
  noteContentSelector,
  dropdownUrlSelector,
} from './xHtml';

/// ---------------------------
/// Birdwatch content modifiers
/// ---------------------------

export const alterRatingPageTwitterNote = (twitterNote) => {
  if (twitterNote.classList.contains('factchain-1.0')) {
    // Add a special class to avoid re-processing the same twitter note multiple times
    // this seems to happen because we are modifying the twitter note, and the modification
    // is caught by the observer below.
    logger.log('Twitter note already processed');
  } else {
    // First time we see this twitter note let's do something with it
    twitterNote.classList.add('factchain-1.0');
    twitterNote.insertAdjacentHTML(
      'afterend',
      makeMintXNoteOnDetailsPageHtml()
    );

    const noteUrl = parseUrl(document.URL, NOTE_URL_REGEX);
    twitterNote.parentNode
      .querySelector('#mintNoteButton')
      .addEventListener('click', async () => {
        const content = twitterNote.querySelector(
          noteContentSelector()
        ).textContent;
        logger.log(
          `Minting twitter from rating page note ${noteUrl} and content '${content}'`
        );
        chrome.runtime.sendMessage({
          type: 'fc-mint-twitter-note',
          noteUrl,
          content,
        });
      });
  }
};

export const alterMainPageTwitterNote = (twitterNote) => {
  if (twitterNote.classList.contains('factchain-1.0')) {
    // Add a special class to avoid re-processing the same twitter note multiple times
    // this seems to happen because we are modifying the twitter note, and the modification
    // is caught by the observer below.
    logger.log('Twitter note already processed');
  } else {
    // First time we see this twitter note let's do something with it
    twitterNote.classList.add('factchain-1.0');
    twitterNote.insertAdjacentHTML('beforeend', makeMintXNoteOnMainPageHtml());
  }
};

/// ---------------------------
/// Default content modifiers
/// ---------------------------

const addNoteCreationButton = (dropdown, postUrl) => {
  dropdown.insertAdjacentHTML('beforeend', makeDropdownNoteCreationButton());

  dropdown.querySelector('#createNoteButton').addEventListener('click', () => {
    logger.log(`Creating note on ${postUrl}`);
    chrome.runtime.sendMessage({
      type: 'fc-create-note',
      postUrl,
    });
  });
};

export const alterDropdown = async (dropdown) => {
  if (dropdown.classList.contains('factchain-1.0')) {
    // Add a special class to avoid re-processing the same dropdown multiple times
    // this seems to happen because we are modifying the dropdown, and the modification
    // is caught by the observer below.
    logger.log('Dropdown already processed');
  } else {
    // First time we see this dropdown let's do something with it
    dropdown.classList.add('factchain-1.0');
    const postUrl = parseUrl(
      dropdown.querySelector(dropdownUrlSelector()).href,
      POST_URL_REGEX
    );
    addNoteCreationButton(dropdown, postUrl);
  }
};

/// ---------------------------
/// Status content modifiers
/// ---------------------------

const addNote = async (mainArticle, note, userAddress) => {
  const isAuthor =
    userAddress &&
    userAddress.toLowerCase() === note.creatorAddress.toLowerCase();
  const rateNoteButtonID =
    !note.finalRating && !isAuthor
      ? `rateNoteButton-${note.creatorAddress}`
      : null;
  const htmlNote = makeFactchainNoteHtml(
    isAuthor,
    note.content,
    rateNoteButtonID
  );
  const tempDiv = mainArticle.children[0].children[0];
  const afterThisDiv = [].slice
    .call(tempDiv.children[tempDiv.children.length - 1].children)
    .find((e) => e.innerHTML === '');
  afterThisDiv.insertAdjacentHTML('afterend', htmlNote);

  if (rateNoteButtonID) {
    mainArticle
      .querySelector(`#${rateNoteButtonID}`)
      .addEventListener('click', () => {
        logger.log('Rating note', note);
        chrome.runtime.sendMessage({
          type: 'fc-rate-note',
          note,
        });
      });
  }
};

export const alterMainArticle = async (mainArticle) => {
  const postUrl = parseUrl(document.URL, POST_URL_REGEX);
  const notes = await chrome.runtime.sendMessage({
    type: 'fc-get-notes',
    postUrl,
  });
  logger.log('received notes', notes);
  if (notes.length > 0) {
    const { address } = await chrome.runtime.sendMessage({
      type: 'fc-get-address',
    });
    for (const note of notes) {
      await addNote(mainArticle, note, address);
    }
  }
};
