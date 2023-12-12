import { logger } from "./logging";
import { alterTwitterNoteSeparator } from "./contentModifiers";

let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      if (addedNode && (typeof addedNode.querySelector) === "function") {
        const separator = addedNode.querySelector("div.css-175oi2r.r-1p6iasa.r-109y4c4.r-gu4em3");
        if (separator) {
          logger.log("Found separator");
          observer.disconnect();
          alterTwitterNoteSeparator(separator);
          return;
        }
      }
    }
  }
});

logger.log("Launching observer for birdwatch");
observer.observe(document, { childList: true, subtree: true });
