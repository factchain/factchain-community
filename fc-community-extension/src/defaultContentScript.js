import { logger } from "./logging";

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

// import { createFactCheckProvider } from "./web3";
// const provider = createFactCheckProvider();

// const addNoteRatingButton = (dropdown, postUrl) => {
//   chrome.runtime.sendMessage({
//     type: 'fc-get-notes',
//     postUrl,
//   }, async (notes) => {
//     logger.log('received notes', notes);
//     const currentAddress = await provider.getAddress();
//     notes = notes.filter(n => n.creator.toLowerCase() !== currentAddress.toLowerCase());
//     if (notes.length > 0) {
//       dropdown.insertAdjacentHTML("beforeend", `<div role="menuitem" tabindex="0" class="css-1dbjc4n r-1loqt21 r-18u37iz r-1ny4l3l r-ymttw5 r-1f1sjgu r-o7ynqc r-6416eg r-13qz1uu" data-testid="fc-note"> \
//         <div class="css-1dbjc4n r-1777fci r-j2kj52"> \
//           <svg viewBox="0 0 24 24" aria-hidden="true" class="r-1nao33i r-4qtqp9 r-yyyyoo r-1q142lx r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg> \
//         </div> \
//         <div class="css-1dbjc4n r-16y2uox r-1wbh5a2" id="rateNoteButton"> \
//           <div dir="ltr" class="css-901oao r-1nao33i r-1qd0xha r-a023e6 r-b88u0q r-rjixqe r-bcqeeo r-qvutc0"> \
//             <span class="css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0">Rate ${notes.length} FactChain Notes</span> \
//           </div> \
//         </div> \
//       </div>`);

//       dropdown.querySelector("#rateNoteButton").addEventListener("click", () => {
//         logger.log(`Rating note on ${postUrl}`);
//         chrome.runtime.sendMessage({
//           type: 'fc-rate-notes',
//           notes
//         });
//       });
//     }
//   });
// }

const alterDropdown = (dropdown) => {
  if (dropdown.classList.contains("factchain-1.0")) {
    // Add a special class to avoid re-processing the same dropdown multiple times
    // this seems to happen because we are modifying the dropdown, and the modification
    // is caught by the observer below.
    logger.log("Dropdown already processed");
  } else {
    // First time we see this dropdown let's do something with it
    dropdown.classList.add("factchain-1.0");
    const postUrl = dropdown.querySelector("a[data-testid='tweetEngagements']").href.split("/").slice(0, -1).join("/");

    addNoteCreationButton(dropdown, postUrl);
    // addNoteRatingButton(dropdown, postUrl);
  }
}

let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      const dropdown = addedNode.querySelector("div[data-testid='Dropdown']");
      if (dropdown) {
        logger.log("New dropdown");
        alterDropdown(dropdown);
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
