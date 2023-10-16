import { logger } from "./logging";
import { createFactCheckProvider } from "./web3";

const provider = createFactCheckProvider();
const contract = await provider.getContract();


const notify = (title, content, postUrl) => {
  logger.log("Requestion notification");
  chrome.runtime.sendMessage({
    type: 'fc-notify',
    postUrl,
    title,
    content,
  });
};

contract.on("NoteCreated", async (postUrl, creator, stake, event) => {
  logger.log("New note created", event);
  const address = await provider.getAddress();
  if (address.toLowerCase() === creator.toLowerCase()) {
    notify("New note", `Your note was successfuly created!`, postUrl);
  } else {
    logger.log(`Not a notification for address ${address} (creator=${creator})`);
  }
});

logger.log("Listening to contract events");
// provider.onEvents(
//   [
//     "NoteCreated(string,address,uint256)",
//     "NoteRated(string,address,address,uint8,uint256)",
//     "RaterRewarded(string,address,address,uint256,uint256)",
//     "RaterSlashed(string,address,address,uint256,uint256)",
//     "CreatorRewarded(string,address,uint256,uint256)",
//     "CreatorSlashed(string,address,uint256,uint256)",
//     "NoteFinalised(string,address,uint8)",
//   ],
//   (log, event) => {
//     logger.log("New event", log, event);
//   }
// );