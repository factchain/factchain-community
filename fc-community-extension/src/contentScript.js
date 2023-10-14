import { render } from "solid-js/web";
import { createMetaMaskProvider } from "./provider";
import { FCButton, FCAddress } from "./components";
import { logger } from "./logging";

const provider = createMetaMaskProvider();

const alterHomeBlock = (homeBlock) => {
  if (homeBlock.classList.contains("fact-chain-1.0")) {
    // Add a special class to avoid re-processing the same article multiple times
    // this seems to happen because we are modifying the <article>, and the modification
    // is caught by the observer below.
    logger.log("HomeBlock already processed");
  } else {
    // First time we see this article let's do something with it
    homeBlock.classList.add("fact-chain-1.0");
    const homeHeader = homeBlock.querySelector("h2");
    const addressDiv = document.createElement("div");
    homeHeader.insertAdjacentElement("afterend", addressDiv);
    render(() => <FCAddress provider={provider} />, addressDiv);
  }
};

const alterArticle = (article) => {
  if (article.classList.contains("fact-chain-1.0")) {
    // Add a special class to avoid re-processing the same article multiple times
    // this seems to happen because we are modifying the <article>, and the modification
    // is caught by the observer below.
    logger.log("Article already processed");
  } else {
    // First time we see this article let's do something with it
    article.classList.add("fact-chain-1.0");
    // Selectors on twitter are crap, maybe intentionally so. Maybe there's a better
    // way to find the elements we're looking for?
    const header = article.querySelector("div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2");
    const cta = document.createElement("div");
    header.insertAdjacentElement("afterend", cta);
    render(() => <FCButton />, cta);
  }
}

// Watch DOM modifications, waiting for new <article> elements to be added
let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      const articles = addedNode.querySelectorAll("article");
      for (const article of articles) {
        logger.log("New article");
        alterArticle(article);
      }

      const homeBlock = addedNode.querySelector("div.css-1dbjc4n.r-16y2uox.r-1wbh5a2.r-1pi2tsx.r-1777fci");
      if (homeBlock && ["Home", "Post"].indexOf(homeBlock.textContent) >= 0) {
        logger.log("New home block");
        alterHomeBlock(homeBlock);
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
