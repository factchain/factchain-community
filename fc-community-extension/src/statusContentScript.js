import { logger } from "./utils/logging";
import { alterMainArticle } from "./contentModifiers";
import { xSelectors } from "./utils/selectors";

let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      if (addedNode && (typeof addedNode.querySelector) === "function") {
        const mainArticle = addedNode.querySelector(xSelectors.mainArticle);
        if (mainArticle) {
          // Triggered whenever an article details page is displayed.
          logger.log("Found main article", mainArticle);
          observer.disconnect();
          alterMainArticle(mainArticle);
          return;
        }
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
