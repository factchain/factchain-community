import { logger } from "./logging";
import { mintXNote } from "./mint";
import { parseUrl, NOTE_URL_REGEX, POST_URL_REGEX } from "./constants";


/// ---------------------------
/// Birdwatch content modifiers
/// ---------------------------

const makeSeparatorMintNoteHtml = () => {
  return `<div class="css-175oi2r r-g2wdr4 r-nsbfu8">
    <div class="css-175oi2r r-1awozwy r-18u37iz r-1wtj0ep">
      <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-a023e6 r-rjixqe r-b88u0q" style="color: rgb(231, 233, 234); text-overflow: unset;">
        <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Like this note?</span>
      </div>
      <div class="css-175oi2r r-18u37iz">
        <div role="button" id="mintNoteButton" tabindex="0" class="css-175oi2r r-sdzlij r-1phboty r-rs99b7 r-lrvibr r-791edh r-id7aif r-15ysp7h r-4wgw6l r-ymttw5 r-o7ynqc r-6416eg r-1ny4l3l" style="background-color: rgba(0, 0, 0, 0); border-color: rgb(83, 100, 113);">
          <div dir="ltr" class="css-1rynq56 r-bcqeeo r-qvutc0 r-1qd0xha r-q4m81j r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1777fci" style="color: rgb(29, 155, 240); text-overflow: unset;">
            <span class="css-1qaijid r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-qvutc0 r-poiln3 r-1b43r93 r-1cwl3u0" style="text-overflow: unset;">
              <span class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3" style="text-overflow: unset;">Mint it</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="css-175oi2r r-1p6iasa r-109y4c4 r-gu4em3"></div>
  `;
}

export const alterTwitterNoteSeparator = (separator) => {
  separator.insertAdjacentHTML("afterend", makeSeparatorMintNoteHtml());

  const noteUrl = parseUrl(document.URL, NOTE_URL_REGEX);
  document.querySelector("#mintNoteButton").addEventListener("click", async () => {
    const contentBlocks = document.querySelectorAll("div.css-1rynq56.r-bcqeeo.r-qvutc0.r-1qd0xha.r-a023e6.r-rjixqe.r-16dba41.r-1udh08x");
    const content = contentBlocks[contentBlocks.length - 1].textContent;
    logger.log(`Minting twitter note ${noteUrl}`);
    chrome.runtime.sendMessage({
      type: 'fc-mint-twitter-note',
      noteUrl,
      content,
    }, async (res) => {
      logger.log("Got res for note", res);
      const {transaction, error} = await mintXNote(res.id, 1, res.hash, res.signature);
      if (error) {
        logger.log(`Failed to mint note: ${error}`);
      } else {
        logger.log(`Success! ${transaction}`);
      }
    });
  });
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

export const alterTwitterNote = (twitterNote) => {
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
  dropdown.insertAdjacentHTML("beforeend", `<div role="menuitem" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-ymttw5 r-1f1sjgu r-o7ynqc r-6416eg r-13qz1uu" data-testid="fc-note"> \
    <div class="css-1dbjc4n r-1777fci r-j2kj52"> \
      <svg viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg> \
    </div> \
    <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="createNoteButton"> \
      <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0"> \
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Create FactChain Note</span> \
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

const addNoteRatingButton = (dropdown, postUrl) => {
  chrome.runtime.sendMessage({
    type: 'fc-get-notes',
    postUrl,
  }, async (notes) => {
    logger.log('received notes', notes);
    if (notes.length > 0) {
      dropdown.insertAdjacentHTML("beforeend", `<div role="menuitem" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-ymttw5 r-1f1sjgu r-o7ynqc r-6416eg r-13qz1uu" data-testid="fc-note"> \
        <div class="css-1dbjc4n r-1777fci r-j2kj52"> \
          <svg viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg> \
        </div> \
        <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="rateNoteButton"> \
          <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0"> \
            <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Rate ${notes.length} FactChain Notes</span> \
          </div> \
        </div> \
      </div>`);

      dropdown.querySelector("#rateNoteButton").addEventListener("click", () => {
        logger.log(`Rating note on ${postUrl}`);
        chrome.runtime.sendMessage({
          type: 'fc-rate-notes',
          notes
        });
      });
    }
  });
}

export const alterDropdown = (dropdown) => {
  if (dropdown.classList.contains("factchain-1.0")) {
    // Add a special class to avoid re-processing the same dropdown multiple times
    // this seems to happen because we are modifying the dropdown, and the modification
    // is caught by the observer below.
    logger.log("Dropdown already processed");
  } else {
    // First time we see this dropdown let's do something with it
    dropdown.classList.add("factchain-1.0");

    const postUrl = parseUrl(dropdown.querySelector("a[data-testid='tweetEngagements']").href, POST_URL_REGEX);

    addNoteCreationButton(dropdown, postUrl);
    addNoteRatingButton(dropdown, postUrl);
  }
}

/// ---------------------------
/// Status content modifiers
/// ---------------------------

const makeFactChainHtmlNote = (note) => {
  const title = "FactChain users added context";
  const rateItHtml = `<span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
    <div class="css-1dbjc4n r-1awozwy r-1roi411 r-5kkj8d r-18u37iz r-16y2uox r-1wtj0ep r-1e081e0 r-1f1sjgu">
      <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-1b43r93 r-16dba41 r-1cwl3u0 r-bcqeeo r-qvutc0">
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Do you find this helpful?</span>
      </div>
      <div id="rateNoteButton" tabindex="0" class="css-18t94o4 css-1dbjc4n r-1niwhzg r-sdzlij r-1phboty r-rs99b7 r-1loqt21 r-15ysp7h r-4wgw6l r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr" style="border-color: rgb(83, 100, 113);">
        <div dir="ltr" class="css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0" style="color: rgb(239, 243, 244);">
          <span class="css-901oao css-16my406 css-1hf3ou5 r-poiln3 r-1b43r93 r-1cwl3u0 r-bcqeeo r-qvutc0">
            <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Rate it</span>
          </span>
        </div>
      </div>
    </div>`;

  return `<div tabindex="0" class="css-1dbjc4n r-1kqtdi0 r-1867qdf r-rs99b7 r-1loqt21 r-1s2bzr4 r-1ny4l3l r-1udh08x r-o7ynqc r-6416eg" data-testid="birdwatch-pivot" role="link">
    <div class="css-1dbjc4n r-k4xj1c r-g2wdr4 r-6koalj r-18u37iz r-1e081e0 r-1f1sjgu">
      <div class="css-1dbjc4n r-18u37iz r-13qz1uu">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-1kb76zh r-dnmrzs r-bnwqim r-1plcrui r-lrvibr" data-testid="icon-birdwatch-fill"><g><path d="M5.5 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm18.25 13.91c-.18-2.01-.78-3.72-1.81-4.96C20.89 10.7 19.45 10 17.75 10c-.35 0-.68.03-1.01.09-.18.54-.45 1.05-.8 1.49.74.46 1.41 1.05 1.99 1.76 1.05 1.3 1.71 2.91 2.06 4.66h3.85l-.09-1.09zM18.5 9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM6.07 13.34c.58-.71 1.25-1.3 1.99-1.76-.35-.44-.62-.95-.8-1.49-.33-.06-.66-.09-1.01-.09-1.7 0-3.14.7-4.19 1.95C1.032 13.19.433 14.9.254 16.91L.157 18H4.01c.35-1.75 1.01-3.36 2.06-4.66zM15 8.5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-7.37 6.1c-1.07 1.32-1.69 3.15-1.88 5.31L5.66 21h12.68l-.09-1.09c-.19-2.16-.81-3.99-1.88-5.31-1.08-1.35-2.59-2.1-4.37-2.1s-3.28.75-4.37 2.1z"></path></g></svg>
        <div dir="ltr" class="css-901oao r-1awozwy r-1nao33i r-6koalj r-1qd0xha r-1b43r93 r-b88u0q r-1cwl3u0 r-bcqeeo r-1vvnge1 r-13qz1uu r-qvutc0">
          <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${title}</span>
        </div>
      </div>
    </div>
    <span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
    <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-1e081e0 r-qvutc0">
      <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">
        <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">${note.content}</span>
      </span>
    </div>
    ${rateItHtml}
  </div>`;
}

const addNote = (mainArticle, note) => {
  const htmlNote = makeFactChainHtmlNote(note);
  // article
  //   div
  //     div
  //       last div
  //         insert after the div that has no content
  const tempDiv = mainArticle.children[0].children[0]
  const afterThisDiv = [].slice.call(tempDiv.children[tempDiv.children.length - 1].children).find(e => e.innerHTML === "");
  afterThisDiv.insertAdjacentHTML("afterend", htmlNote);

  if (withRateIt) {
    logger.log(`Creator of note is not current user (${note.creator} !== ${currentAddress})`)
    mainArticle.querySelector("#rateNoteButton").addEventListener("click", () => {
      logger.log("Rating note", note);
      chrome.runtime.sendMessage({
        type: 'fc-rate-notes',
        notes: [note],
      });
    });
  }
};

export const alterMainArticle = (mainArticle) => {
  const postUrl = parseUrl(document.URL, POST_URL_REGEX);

  chrome.runtime.sendMessage({
    type: 'fc-get-notes',
    postUrl,
  }, async (notes) => {
    logger.log('received notes', notes);
    if (notes.length > 0) {
      for (const note of notes) {
        addNote(mainArticle, note);
      }
    }
  });
};
