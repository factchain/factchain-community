const log = (message) => {
  console.log(`TrueMint> ${message}`);
}

const alterArticle = (article) => {
  if (article.classList.contains("tm-community-1.0")) {
    // Add a special class to avoid re-processing the same article multiple times
    // this seems to happen because we are modifying the <article>, and the modification
    // is caught by the observer below.
    log("Article already processed");
  } else {
    // First time we see this article let's do something with it
    article.classList.add("tm-community-1.0");
    // Selectors on twitter are crap, maybe intentionally so. Maybe there's a better
    // way to find the elements we're looking for?
    const header = article.querySelector("div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2");
    const badge = document.createElement("div");
    badge.textContent = `✅ TRUEMINT ✅`;
    header.insertAdjacentElement("afterend", badge);
  }
}

// Watch DOM modifications, waiting for new <article> elements to be added
let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let addedNode of mutation.addedNodes) {
      const articles = addedNode.querySelectorAll("article");
      for (const article of articles) {
        log("New article");
        alterArticle(article);
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
