
export const logger = {
  log: (message, ...args) => { console.log(`FactChain> ${message}`, ...args); },
  error: (message) => { console.error(`FactChain> ${message}`, ...args); },
};
