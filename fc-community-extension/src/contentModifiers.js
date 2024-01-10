import { logger } from "./utils/logging";
import { createFactchainProvider } from "./utils/web3";
import { parseUrl, NOTE_URL_REGEX, POST_URL_REGEX } from "./utils/constants";
import { xSelectors } from "./utils/selectors";


/// ---------------------------
/// Birdwatch content modifiers
/// ---------------------------

const separatorMintNoteHtml =
  `<div class="css-175oi2r r-g2wdr4 r-nsbfu8 r-1xfd6ze">
    <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(231, 233, 234); text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Like this note?</span>
      </div>
      <div class="css-175oi2r r-18u37iz">
        <div id="mintNoteButton" role="button" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-1loqt21 r-o7ynqc r-6416eg r-1ny4l3l" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(29, 155, 240); text-overflow: unset;">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Mint it</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>`;


export const alterRatingPageTwitterNote = (twitterNote) => {
  if (twitterNote.classList.contains("factchain-1.0")) {
    // Add a special class to avoid re-processing the same twitter note multiple times
    // this seems to happen because we are modifying the twitter note, and the modification
    // is caught by the observer below.
    logger.log("Twitter note already processed");
  } else {
    // First time we see this twitter note let's do something with it
    twitterNote.classList.add("factchain-1.0");
    twitterNote.insertAdjacentHTML("afterend", separatorMintNoteHtml);

    const noteUrl = parseUrl(document.URL, NOTE_URL_REGEX);
    twitterNote.parentNode.querySelector("#mintNoteButton").addEventListener("click", async () => {
      const content = twitterNote.querySelector(xSelectors.noteContent).textContent
      logger.log(`Minting twitter from rating page note ${noteUrl} and content '${content}'`);
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
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Mint it</span>
        </span>
      </div>
    </div>
  </div>`;
}

export const alterMainPageTwitterNote = (twitterNote) => {
  if (twitterNote.classList.contains("factchain-1.0")) {
    // Add a special class to avoid re-processing the same twitter note multiple times
    // this seems to happen because we are modifying the twitter note, and the modification
    // is caught by the observer below.
    logger.log("Twitter note already processed");
  } else {
    // First time we see this twitter note let's do something with it
    twitterNote.classList.add("factchain-1.0");
    twitterNote.insertAdjacentHTML("beforeend", makeMintNoteHtml());
  }
};

/// ---------------------------
/// Default content modifiers
/// ---------------------------

const addNoteCreationButton = (dropdown, postUrl) => {
  dropdown.insertAdjacentHTML("beforeend", `<a role="menuitem" class="css-175oi2r r-18u37iz r-ymttw5 r-1f1sjgu r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" data-testid="fc-note"> \
    <div class="css-1dbjc4n r-1777fci r-j2kj52"> \
      <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx"><g><path d="M19 16h2.6c-.23-1.2-.66-2.12-1.2-2.77-.67-.8-1.55-1.23-2.65-1.23-.51 0-.96.09-1.36.26l-.78-1.84c.67-.28 1.38-.42 2.14-.42 1.7 0 3.14.7 4.19 1.95 1.03 1.24 1.63 2.95 1.81 4.96l.09 1.09H19v-2zM5 16H2.4c.23-1.2.66-2.12 1.2-2.77.67-.8 1.55-1.23 2.65-1.23.51 0 .96.09 1.36.26l.78-1.84c-.67-.28-1.38-.42-2.14-.42-1.7 0-3.14.7-4.19 1.95C1.032 13.19.433 14.9.254 16.91L.157 18H5v-2zM15.5 6c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm2 0c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm-12-3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 2c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6.5 6.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 3c1.78 0 3.29.75 4.37 2.1 1.07 1.32 1.69 3.15 1.88 5.31l.09 1.09H5.66l.09-1.09c.19-2.16.81-3.99 1.88-5.31 1.08-1.35 2.59-2.1 4.37-2.1zm-2.82 3.35c-.59.74-1.05 1.79-1.29 3.15h8.22c-.24-1.36-.7-2.41-1.29-3.15-.72-.88-1.66-1.35-2.82-1.35s-2.1.47-2.82 1.35z"></path></g></svg> \
    </div> \
    <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="createNoteButton"> \
      <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0"> \
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Create Factchain Note</span> \
      </div> \
    </div> \
  </div>`);

  dropdown.querySelector("#createNoteButton").addEventListener("click", () => {
    logger.log(`Creating note on ${postUrl}`);
    chrome.runtime.sendMessage({
      type: 'fc-create-note',
      postUrl,
    });
  });
}

export const alterDropdown = async (dropdown) => {
  if (dropdown.classList.contains("factchain-1.0")) {
    // Add a special class to avoid re-processing the same dropdown multiple times
    // this seems to happen because we are modifying the dropdown, and the modification
    // is caught by the observer below.
    logger.log("Dropdown already processed");
  } else {
    // First time we see this dropdown let's do something with it
    dropdown.classList.add("factchain-1.0");
    const postUrl = parseUrl(dropdown.querySelector(xSelectors.dropdownUrl).href, POST_URL_REGEX);
    addNoteCreationButton(dropdown, postUrl);
  }
}

/// ---------------------------
/// Status content modifiers
/// ---------------------------


const rateItHtml = `<span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
<div class="css-175oi2r r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
  <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-16dba41" style="text-overflow: unset; color: rgb(231, 233, 234);">
    <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Do you find this helpful?</span>
  </div>
  <div id="rateNoteButton" role="link" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21" style="border-color: rgb(83, 100, 113); background-color: rgba(0, 0, 0, 0);">
    <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="text-overflow: unset; color: rgb(239, 243, 244);">
      <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Rate it</span>
      </span>
    </div>
  </div>
</div>`;

const makeFactchainHtmlNote = (note, userAddress) => {
  const author = userAddress && userAddress.toLowerCase() === note.creatorAddress.toLowerCase() ? "You" : "Factchain users"
  let noteHTML = `<div tabindex="0" class="css-1dbjc4n r-1kqtdi0 r-1867qdf r-rs99b7 r-1loqt21 r-1s2bzr4 r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg" data-testid="birdwatch-pivot" role="link">
    <div class="css-175oi2r r-k4xj1c r-g2wdr4 r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
      <div class="css-175oi2r r-18u37iz r-13qz1uu">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1cvl2hr r-1q142lx r-1kb76zh" data-testid="icon-birdwatch-fill"><g><path d="M5.5 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18.25 13.91c-.18-2.01-.78-3.72-1.81-4.96C20.89 10.7 19.45 10 17.75 10c-.35 0-.68.03-1.01.09-.18.54-.45 1.05-.8 1.49.74.46 1.41 1.05 1.99 1.76 1.05 1.3 1.71 2.91 2.06 4.66h3.85l-.09-1.09zM18.5 9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM6.07 13.34c.58-.71 1.25-1.3 1.99-1.76-.35-.44-.62-.95-.8-1.49-.33-.06-.66-.09-1.01-.09-1.7 0-3.14.7-4.19 1.95C1.032 13.19.433 14.9.254 16.91L.157 18H4.01c.35-1.75 1.01-3.36 2.06-4.66zM15 8.5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-7.37 6.1c-1.07 1.32-1.69 3.15-1.88 5.31L5.66 21h12.68l-.09-1.09c-.19-2.16-.81-3.99-1.88-5.31-1.08-1.35-2.59-2.1-4.37-2.1s-3.28.75-4.37 2.1z"></path></g></svg>
        <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-1cwl3u0 r-b88u0q r-1awozwy r-6koalj r-1vvnge1 r-13qz1uu" style="text-overflow: unset; color: rgb(231, 233, 234);">
          <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">${author} added context</span>
        </div>
      </div>
    </div>
    <span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
    <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-1e081e0 r-qvutc0">
      <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${note.content}</span>
      </span>
    </div>
  `;

  if (!note.finalRating) {
    if (!userAddress || author !== "You") {
      noteHTML += `<div>${rateItHtml}</div></div>`
    }
  }
  return noteHTML;
}

const addNote = async (mainArticle, note) => {
  const provider = await createFactchainProvider();
  const userAddress = await provider.getAddress();
  let htmlNote = makeFactchainHtmlNote(note, userAddress);
  const tempDiv = mainArticle.children[0].children[0]
  const afterThisDiv = [].slice.call(tempDiv.children[tempDiv.children.length - 1].children).find(e => e.innerHTML === "");
  afterThisDiv.insertAdjacentHTML("afterend", htmlNote);
  const rateNoteButton = mainArticle.querySelector("#rateNoteButton")

  if (rateNoteButton) {
    mainArticle.querySelector("#rateNoteButton").addEventListener("click", () => {
      logger.log("Rating note", note);
      chrome.runtime.sendMessage({
        type: 'fc-rate-notes',
        notes: [note],
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
    for (const note of notes) {
      await addNote(mainArticle, note);
    }
  }
};
