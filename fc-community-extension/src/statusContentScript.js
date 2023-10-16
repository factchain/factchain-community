import { logger } from "./logging";
import { createFactCheckProvider } from "./web3";

const provider = createFactCheckProvider();

const makeFactChainHtmlNote = (note, withRateIt) => {
  let title = "You added this context";
  let rateItHtml = "";
  if (withRateIt) {
    title = "FactChain users added context";
    rateItHtml = `<span class="r-4qtqp9" style="min-height: 12px; min-width: 12px;"></span>
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
  }

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

const addNote = (mainArticle, note, currentAddress) => {
  const withRateIt = note.creator.toLowerCase() !== currentAddress.toLowerCase();
  const htmlNote = makeFactChainHtmlNote(note, withRateIt);
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

const alterMainArticle = (mainArticle) => {
  const postRegex = /^(https:\/\/(twitter|x).com\/.+?\/status\/\d+).*$/;
  const postUrl = document.URL.match(postRegex)[1];

  chrome.runtime.sendMessage({
    type: 'fc-get-notes',
    postUrl,
  }, async (notes) => {
    logger.log('received notes', notes);
    if (notes.length > 0) {
      const currentAddress = await provider.getAddress();
      for (const note of notes) {
        addNote(mainArticle, note, currentAddress);
      }
    }
  });
};

let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      const mainArticle = addedNode.querySelector("article[tabindex='-1']");
      if (mainArticle) {
        logger.log("Found main article", mainArticle);
        observer.disconnect();
        alterMainArticle(mainArticle);
        return;
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
