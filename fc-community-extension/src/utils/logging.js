
export const logger = {
  log: (message, ...args) => { console.log(`Factchain> ${message}`, ...args); },
  error: (message, ...args) => { console.error(`Factchain> ${message}`, ...args); },
};
