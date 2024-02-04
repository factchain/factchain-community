import { logger } from './utils/logging';
import {
  alterDropdown,
  alterRatingPageTwitterNote,
  alterMainPageTwitterNote,
} from './contentModifiers';
import {
  approvedNotesSelector,
  dropdownSelector,
  ratingStatusSelector,
} from './xHtml';

let observer = new MutationObserver(async (mutations) => {
  for (let mutation of mutations) {
    for (let addedNode of mutation.addedNodes) {
      if (addedNode && typeof addedNode.querySelector === 'function') {
        const dropdown = addedNode.querySelector(dropdownSelector());
        if (dropdown) {
          // Triggered whenever the user opens a dropdown on an article.
          logger.log('New dropdown', dropdown);
          await alterDropdown(dropdown);
        }

        const ratingStatuses = Array.from(
          addedNode.querySelectorAll(ratingStatusSelector())
        );
        // Only keep the rating statuses that are for helpful notes.
        const helpfulRatings = ratingStatuses.filter(
          (e) => e.textContent.indexOf('Currently rated helpful') >= 0
        );
        if (helpfulRatings.length > 0) {
          // Triggered whenever a note with a helpful rating is displayed
          // on an article details page.
          // Once we find the helpful rating, we get the grandparent,
          // which is the full note.
          const helpfulNote = helpfulRatings[0].parentNode.parentNode;
          logger.log('Found helpful note', helpfulNote);
          alterRatingPageTwitterNote(helpfulNote);
        }

        const twitterNote = addedNode.querySelector(approvedNotesSelector());
        if (twitterNote) {
          // Triggered whenever an approved note is displayed, on any page
          // but mostly on the main feed.
          logger.log('Found twitter note', twitterNote);
          alterMainPageTwitterNote(twitterNote);
        }
      }
    }
  }
});

observer.observe(document, { childList: true, subtree: true });
