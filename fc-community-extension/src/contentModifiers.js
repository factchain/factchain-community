import { logger } from './utils/logging';
import { parseUrl, NOTE_URL_REGEX, POST_URL_REGEX } from './utils/constants';
import { xSelectors } from './utils/selectors';

/// ---------------------------
/// Birdwatch content modifiers
/// ---------------------------

const logoSvg = '<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; margin-right: 5px; overflow: visible; fill: #00adb5; stroke: #00adb5;" viewBox="0 0 512 512" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"><path d="M483.4 244.2L351.9 287.1h97.74c-9.874 10.62 3.75-3.125-46.24 46.87l-147.6 49.12h98.24c-74.99 73.12-194.6 70.62-246.8 54.1l-66.14 65.99c-9.374 9.374-24.6 9.374-33.98 0s-9.374-24.6 0-33.98l259.5-259.2c6.249-6.25 6.249-16.37 0-22.62c-6.249-6.249-16.37-6.249-22.62 0l-178.4 178.2C58.78 306.1 68.61 216.7 129.1 156.3l85.74-85.68c90.62-90.62 189.8-88.27 252.3-25.78C517.8 95.34 528.9 169.7 483.4 244.2z"></path></svg>';

const separatorMintNoteHtml = `<div class="css-175oi2r r-g2wdr4 r-nsbfu8 r-1xfd6ze">
    <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(231, 233, 234); text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Like this note?</span>
      </div>
      <div class="css-175oi2r r-18u37iz">
        <div id="mintNoteButton" role="button" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(29, 155, 240); text-overflow: unset;">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>`;

export const alterRatingPageTwitterNote = (twitterNote) => {
  if (twitterNote.classList.contains('factchain-1.0')) {
    // Add a special class to avoid re-processing the same twitter note multiple times
    // this seems to happen because we are modifying the twitter note, and the modification
    // is caught by the observer below.
    logger.log('Twitter note already processed');
  } else {
    // First time we see this twitter note let's do something with it
    twitterNote.classList.add('factchain-1.0');
    twitterNote.insertAdjacentHTML('afterend', separatorMintNoteHtml);

    const noteUrl = parseUrl(document.URL, NOTE_URL_REGEX);
    twitterNote.parentNode
      .querySelector('#mintNoteButton')
      .addEventListener('click', async () => {
        const content = twitterNote.querySelector(
          xSelectors.noteContent
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

const makeMintNoteHtml = () => {
  return `<div class="css-175oi2r r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
    <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-1b43r93 r-1cwl3u0 r-16dba41" style="color: rgb(231, 233, 234); text-overflow: unset;">
      <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Like this note?</span>
    </div>
    <div role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(239, 243, 244); text-overflow: unset;">
        <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Collect it</span>
        </span>
      </div>
    </div>
  </div>`;
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
    twitterNote.insertAdjacentHTML('beforeend', makeMintNoteHtml());
  }
};

/// ---------------------------
/// Default content modifiers
/// ---------------------------

const addNoteCreationButton = (dropdown, postUrl) => {
  dropdown.insertAdjacentHTML(
    'beforeend',
    `<a role="menuitem" class="css-175oi2r r-18u37iz r-ymttw5 r-1f1sjgu r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="fc-note"> \
    <div class="css-1dbjc4n r-1777fci r-j2kj52"> \
      ${logoSvg}
    </div> \
    <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="createNoteButton"> \
      <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0"> \
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Create Factchain Note</span> \
      </div> \
    </div> \
  </div>`
  );

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
      dropdown.querySelector(xSelectors.dropdownUrl).href,
      POST_URL_REGEX
    );
    addNoteCreationButton(dropdown, postUrl);
  }
};

/// ---------------------------
/// Status content modifiers
/// ---------------------------

const rateItHtml = (
  rateNoteButtonID
) => `<span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
<div class="css-175oi2r r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
  <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(231, 233, 234);">
    <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you find this helpful?</span>
  </div>
  <div id="${rateNoteButtonID}" role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
    <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(239, 243, 244);">
      <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Rate it</span>
      </span>
    </div>
  </div>
</div>`;

const makeFactchainHtmlNote = (isAuthor, content, rateNoteButtonID) => {
  const author = isAuthor ? 'You' : 'Factchain users';
  let noteHTML = `<div tabindex="0" class="css-1dbjc4n r-1kqtdi0 r-1867qdf r-rs99b7 r-1loqt21 r-1s2bzr4 r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg" data-testid="birdwatch-pivot" role="link">
    <div class="css-175oi2r r-k4xj1c r-g2wdr4 r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
      <div class="css-175oi2r r-18u37iz r-13qz1uu">
        ${logoSvg}
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-b88u0q r-1awozwy r-6koalj r-1vvnge1 r-13qz1uu" style="text-overflow: unset; color: rgb(231, 233, 234);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${author} added context</span>
        </div>
      </div>
    </div>
    <span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
    <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-1e081e0 r-qvutc0">
      <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${content}</span>
      </span>
    </div>
  `;

  if (rateNoteButtonID) {
    noteHTML += `<div>${rateItHtml(rateNoteButtonID)}</div>`;
  }
  noteHTML += '</div>';
  return noteHTML;
};

const addNote = async (mainArticle, note, userAddress) => {
  const isAuthor =
    userAddress &&
    userAddress.toLowerCase() === note.creatorAddress.toLowerCase();
  const rateNoteButtonID =
    !note.finalRating && !isAuthor
      ? `rateNoteButton-${note.creatorAddress}`
      : null;
  const htmlNote = makeFactchainHtmlNote(
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
