import { logger } from "./logging";
import { alterDropdown, alterNote } from "./contentModifiers";


let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      if (addedNode && (typeof addedNode.querySelector) === "function") {
        const dropdown = addedNode.querySelector("div[data-testid='Dropdown']");
        if (dropdown) {
          logger.log("New dropdown");
          alterDropdown(dropdown);
        }

        const separator = addedNode.querySelector("div.css-175oi2r.r-1p6iasa.r-109y4c4.r-gu4em3");
        if (separator) {
          logger.log("Found separator", separator);
          alterNote(separator);
        }
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
