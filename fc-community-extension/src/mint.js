import { logger } from "./logging";
import { createFactCheckProvider, handleContractCallError } from "./web3";

// TODO move to a better place
export const mintXNote = async (noteId, value, hash, signature) => {
  logger.log("Minting X note", noteId, value, hash, signature);
  const provider = createFactCheckProvider();
  const contract = await provider.getFC1155Contract();
  let transaction = null;
  let error = null;

  try {
    if (signature) {
      transaction = await contract.mint(
        noteId,
        value,
        hash.startsWith("0x") ? hash : `0x${hash}`,
        signature,
        {value: value * 1_000_000},
      );
    } else {
      transaction = await contract.mint(noteId, value, {value: value * 1_000_000});
    }
  } catch (e) {
    logger.log("Failed to mint note", e);
    error = handleContractCallError(e);
  }
  return {transaction, error};
};