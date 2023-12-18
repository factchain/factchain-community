import { logger } from "./utils/logging";
import { alterDropdown, alterRatingPageTwitterNote, alterMainPageTwitterNote } from "./contentModifiers";


let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      if (addedNode && (typeof addedNode.querySelector) === "function") {
        const dropdown = addedNode.querySelector("div[data-testid='Dropdown']");
        if (dropdown) {
          logger.log("New dropdown");
          alterDropdown(dropdown);
        }

        const helpfulRatings = Array.from(addedNode.querySelectorAll("div[data-testid='ratingStatus']")).filter(e => e.textContent.indexOf("Currently rated helpful") >= 0);
        if (helpfulRatings.length > 0) {
          const helpfulNote = helpfulRatings[0].parentNode.parentNode;
          logger.log("Found helpful note", helpfulNote);
          alterRatingPageTwitterNote(helpfulNote);
        }
        
        // all birdwatch components with the classes of an already approved note
        const twitterNote = addedNode.querySelector("div[data-testid='birdwatch-pivot'].css-175oi2r.r-1kqtdi0.r-1udh08x.r-g2wdr4.r-1mhqjh3.r-5kkj8d.r-1va55bh.r-1mnahxq.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21");
        if (twitterNote) {
          logger.log("Found twitter note", twitterNote);
          alterMainPageTwitterNote(twitterNote);
        }
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
