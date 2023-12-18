
export const logger = {
  log: (message, ...args) => { console.log(`FactChain> ${message}`, ...args); },
  error: (message, ...args) => { console.error(`FactChain> ${message}`, ...args); },
};
